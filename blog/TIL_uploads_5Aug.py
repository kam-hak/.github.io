import os
import re
from datetime import datetime
import subprocess
from bs4 import BeautifulSoup

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
    """Extract the TIL section from the note using explicit end marker."""
    with open(note_path, "r") as file:
        content = file.read()

    # Use explicit start and end markers
    start_marker = "# 📖 TIL⚔️"
    end_marker = "/📖 TIL⚔️"

    start_pos = content.find(start_marker)
    if start_pos == -1:
        print("No TIL section start marker found.")
        return None

    # Start after the marker
    start_pos += len(start_marker)

    end_pos = content.find(end_marker, start_pos)
    if end_pos == -1:
        print("No TIL section end marker found.")
        return None

    # Extract the content between markers
    til_content = content[start_pos:end_pos].strip()

    print(f"TIL section found. Length: {len(til_content)}")
    return til_content


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


def process_markdown_content(content):
    """
    Process all Obsidian-style links in markdown content while preserving code blocks.
    This is a complete replacement for remove_obsidian_links.
    """
    # Step 1: Split content into chunks (code blocks and non-code text)
    chunks = []
    current_pos = 0

    # Regular expression to find all code blocks with proper handling of backticks
    # This regex matches:
    # 1. Three backticks
    # 2. Optional language identifier (e.g., "python")
    # 3. All content until three closing backticks
    code_block_regex = r"```(?:[a-zA-Z0-9]+)?\n[\s\S]*?```"

    for match in re.finditer(code_block_regex, content, re.MULTILINE):
        # Add text before code block
        if match.start() > current_pos:
            chunks.append(("text", content[current_pos : match.start()]))

        # Add code block (to be preserved)
        chunks.append(("code", match.group(0)))
        current_pos = match.end()

    # Add any remaining text after the last code block
    if current_pos < len(content):
        chunks.append(("text", content[current_pos:]))

    # Step 2: Process each chunk appropriately
    processed_chunks = []

    for chunk_type, chunk_content in chunks:
        if chunk_type == "code":
            # Preserve code blocks exactly as they are
            processed_chunks.append(chunk_content)
        else:
            # Process Obsidian links in text chunks
            processed_text = process_obsidian_links(chunk_content)
            processed_chunks.append(processed_text)

    # Join all chunks back together
    return "".join(processed_chunks)


def process_obsidian_links(text):
    """Process Obsidian links in text (non-code) chunks."""

    def replace_link(match):
        prefix = match.group(1) or ""  # Extract the leading '!' if present
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

    # Process markdown content with the new function
    processed_content = process_markdown_content(til_content)

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
                "--metadata",
                f"title={title}",  # Set the title metadata
            ],
            check=True,
        )

        # Modify the HTML to add hr before references section
        with open(html_filename, "r") as file:
            html_content = file.read()

        # Use BeautifulSoup for safer HTML parsing
        soup = BeautifulSoup(html_content, "html.parser")

        # Look for the references div that Pandoc generates
        refs_div = soup.find("div", id="refs")
        if refs_div:
            # Create an hr element
            hr = soup.new_tag("hr")
            # Insert it before the references div
            refs_div.insert_before(hr)

        # Format the entire document
        formatted_html = soup.prettify()

        with open(html_filename, "w") as file:
            file.write(formatted_html)

        print(f"HTML post created: {html_filename}")
    except subprocess.CalledProcessError as e:
        print(f"Error converting Markdown to HTML: {e}")
        return None

    return html_filename


def update_blog_index(blog_dir, post_filename, post_title):
    """Prepend the new post to the blog index with proper formatting."""
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

    # Format the HTML with proper indentation
    formatted_html = soup.prettify()

    # Save the updated HTML
    with open(index_path, "w") as file:
        file.write(formatted_html)

    print("Blog index updated with proper formatting.")


def main():
    note_path = get_todays_note_path()
    if not os.path.exists(note_path):
        print(f"Today's note does not exist: {note_path}")
        return

    til_content = extract_til_section(note_path)
    if not til_content:
        print("No TIL section found in the note.")
        return
    # Add after extracting TIL content
    print(f"TIL content length: {len(til_content)}")
    print(f"Last 100 characters: {til_content[-100:]}")
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
