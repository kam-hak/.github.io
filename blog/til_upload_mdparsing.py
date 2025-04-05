import os
import re
from datetime import datetime
import subprocess
from bs4 import BeautifulSoup
from markdown_it import MarkdownIt
from markdown_it.token import Token
from markdown_it.tree import SyntaxTreeNode

# Paths
OBSIDIAN_DIR = "/Users/kamran/Documents/Obv_vault_kamran/98 Timestamps/Daily notes"
BLOG_DIR = "/Users/kamran/.github.io/blog"
ASSETS_DIR = os.path.join(BLOG_DIR, "assets")


def get_todays_note_path():
    """Get the path to today's Obsidian note."""
    today = datetime.now()
    month = today.strftime("%m-%B")
    day = today.strftime("%d-%A")
    return os.path.join(OBSIDIAN_DIR, today.strftime("%Y"), month, f"{day}.md")


def extract_til_section(note_path):
    """Extract the TIL section from the note."""
    with open(note_path, "r") as file:
        content = file.read()

    # Debugging: print the content of the note
    print(
        "Content of the note:", content[:500]
    )  # Show the first 500 characters for brevity

    # Match the TIL section
    match = re.search(r"# 📖 TIL⚔️(.*?)(?=\n# |\Z)", content, re.DOTALL)
    if match:
        print("TIL section found.")  # Debugging: log success
        return match.group(1).strip()

    print("No TIL section matched.")  # Debugging: log failure
    return None


def generate_title_options(til_content):
    """Generate five straightforward descriptions using Ollama."""
    # Create the prompt for generating descriptions
    prompt = f" What are the 2-3 things I learned today in the most abstract sense. Do this five times, each in 5-7 words. Don't number them, and don't use line breaks or lists within any option.:\n\n{til_content}"

    try:
        # Use subprocess to run the ollama command with the specific model
        result = subprocess.run(
            [
                "ollama",
                "run",
                "llama3.2",
                prompt,
            ],
            text=True,
            capture_output=True,
            check=True,  # Raise an error if the subprocess call fails
        )

        # Parse and clean the output
        options = result.stdout.strip().split("\n")  # Assuming output is line-separated
        return [option.strip() for option in options if option.strip()]

    except subprocess.CalledProcessError as e:
        print("An error occurred while calling Ollama:", e)
        return []


def process_obsidian_links(content):
    """
    Process Obsidian-style links using markdown-it-py.
    This replaces the remove_obsidian_links function.
    """
    # Initialize markdown parser
    md = MarkdownIt()

    # Split content to protect code blocks
    parts = []
    current_pos = 0

    # Find all code blocks to protect them
    code_blocks = list(re.finditer(r"```(?:\w+)?\s*[\s\S]*?```", content, re.MULTILINE))

    for match in code_blocks:
        # Add text before code block
        if match.start() > current_pos:
            parts.append(("text", content[current_pos : match.start()]))

        # Add code block (protected)
        parts.append(("code", match.group(0)))
        current_pos = match.end()

    # Add remaining text
    if current_pos < len(content):
        parts.append(("text", content[current_pos:]))

    processed_parts = []

    # Process each part
    for part_type, part_content in parts:
        if part_type == "code":
            # Don't process code blocks
            processed_parts.append(part_content)
        else:
            # Process Obsidian links in text
            processed_text = process_links_in_text(part_content)
            processed_parts.append(processed_text)

    # Join all processed parts
    return "".join(processed_parts)


def process_links_in_text(text):
    """Process Obsidian-style links in non-code text."""

    def replace_link(match):
        prefix = match.group(1)  # Extract the leading '!' if present
        link = match.group(2).strip()  # Extract the link content

        if link.startswith("http"):
            return f'<a href="{link}">{link}</a>'  # Keep web links as anchor tags

        # Split file path and modifier if any
        parts = link.split("|")
        file_path = parts[0].strip()
        modifier = parts[1].strip() if len(parts) > 1 else None

        # Handle different types of links
        if file_path.lower().endswith(
            (".svg", ".png", ".jpg", ".jpeg", ".gif", ".pdf")
        ):
            # Upload the file if it's an image or document
            if not file_path.startswith("/"):
                file_path = os.path.join(
                    "/Users/kamran/Documents/Obv_vault_kamran/100 Extras/Attachments",
                    file_path,
                )

            if os.path.exists(file_path):
                file_name = os.path.basename(file_path)
                asset_path = os.path.join(ASSETS_DIR, file_name)
                os.makedirs(ASSETS_DIR, exist_ok=True)
                with open(file_path, "rb") as src, open(asset_path, "wb") as dst:
                    dst.write(src.read())

                # Handle modifiers for images
                if prefix == "!" or file_path.lower().endswith(
                    (".svg", ".png", ".jpg", ".jpeg", ".gif")
                ):
                    if modifier and modifier.isdigit():
                        return f'<img src="assets/{file_name}" width="{modifier}" alt="{file_name}" />'
                    else:
                        return f'<img src="assets/{file_name}" alt="{file_name}" />'

                # Handle documents
                if file_path.lower().endswith(".pdf"):
                    return (
                        f'<a href="assets/{file_name}" target="_blank">{file_name}</a>'
                    )
            else:
                print(f"File not found: {file_path}")
                return f"<strong>Missing file:</strong> {file_path}"

        # For non-image/document links, remove brackets
        return file_path

    # Pattern to find all Obsidian links
    pattern = re.compile(r"(!?)\[\[(.*?)\]\]")
    return pattern.sub(replace_link, text)


def save_blog_post(title, til_content):
    """Save the TIL section as a markdown file in the blog directory and convert it to HTML."""
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", title.lower()).strip("-")
    today = datetime.now().strftime("%Y-%m-%d")
    md_filename = os.path.join(BLOG_DIR, f"{today}-{slug}.md")
    html_filename = md_filename.replace(".md", ".html")

    # Process Obsidian-style links using markdown-it-py
    processed_content = process_obsidian_links(til_content)

    # Save the Markdown file
    with open(md_filename, "w") as file:
        file.write(f"# {title}\n\n{processed_content}")

    print(f"Markdown post saved: {md_filename}")

    # Convert Markdown to HTML using Pandoc with MathJax
    try:
        subprocess.run(
            [
                "pandoc",
                md_filename,
                "-s",
                "-o",
                html_filename,
                "--mathjax",  # MathJax for math rendering
                "-c",
                "../styles.css",
                "--bibliography=/Users/kamran/Zotero/KH_Library.bib",
                "--citeproc",
            ],
            check=True,
        )
        print(f"HTML post created: {html_filename}")
    except subprocess.CalledProcessError as e:
        print(f"Error converting Markdown to HTML: {e}")
        return None

    return html_filename


def update_blog_index(blog_dir, post_filename, post_title):
    """Prepend the new post to the blog index."""
    index_path = os.path.join(blog_dir, "index.html")

    if not os.path.exists(index_path):
        print(f"Index file not found: {index_path}")
        return

    with open(index_path, "r") as file:
        soup = BeautifulSoup(file, "html.parser")

    # Find the <ul> under <main>
    main = soup.find("main")
    if not main:
        print("No <main> tag found in index.html.")
        return

    ul = main.find("ul")
    if not ul:
        print("No <ul> tag found in index.html.")
        return

    # Create the new <li> element
    date = datetime.now().strftime("%d %b %Y")
    new_li = soup.new_tag("li")
    new_link = soup.new_tag("a", href=f"{post_filename.replace('.md', '.html')}")
    new_link.string = f"{date}: {post_title}"
    new_li.append(new_link)

    # Prepend the new <li> to the <ul>
    ul.insert(0, new_li)

    # Save the updated HTML
    with open(index_path, "w") as file:
        file.write(str(soup))

    print("Blog index updated.")


def main():
    note_path = get_todays_note_path()
    if not os.path.exists(note_path):
        print(f"Today's note does not exist: {note_path}")
        return

    til_content = extract_til_section(note_path)
    if not til_content:
        print("No TIL section found in the note.")
        return

    # Generate evocative title options
    title_options = generate_title_options(til_content)
    if not title_options:
        print("Failed to generate title options.")
        return

    # Prompt the user to select a title or enter their own
    print("Please choose a title from the options below or type your own title:")
    for i, option in enumerate(title_options, 1):
        print(f"{i}. {option}")

    while True:
        user_input = input(
            f"Enter the number of your choice (1-{len(title_options)}) or type your own title: "
        ).strip()

        # Check if the input is a digit and within the valid range
        if user_input.isdigit():
            choice = int(user_input)
            if 1 <= choice <= len(title_options):
                title = title_options[choice - 1]
                break
            else:
                print(
                    f"Invalid choice. Please enter a number between 1 and {len(title_options)}."
                )
        elif user_input:
            # If the input is not a digit and not empty, use it as the custom title
            title = user_input
            break
        else:
            print("Input cannot be empty. Please enter a valid number or title.")

    # Save blog post and convert to HTML
    html_path = save_blog_post(title, til_content)
    if not html_path:
        print("Failed to save the blog post.")
        return

    # Update the blog index
    update_blog_index(BLOG_DIR, os.path.basename(html_path), title)
    print(f"Blog post '{title}' has been successfully saved and converted to HTML.")


if __name__ == "__main__":
    main()
