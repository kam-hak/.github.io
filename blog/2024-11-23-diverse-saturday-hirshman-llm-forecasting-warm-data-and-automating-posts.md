# Diverse Saturday: Hirshman, LLM forecasting, warm-data, and automating posts

- **Hirshman's Tunnel Effect** - the idea that people are ok with inequality if they believe they will eventually benefit Horatio Alger Myth... however, if they don't believe this, then they become very upset.
- **Hirshman's Exit voice loyalty** was mostly concerned with firms. However, to our knowledge, it's never been applied to the concept of social movements and 'voice'
- The 'image' of a matrix with respect to a vector is basically just them multiplied.
- To 'solve' a systems of equations you need to multiply by the inverse... I thinK?
	- A system of equations is essentially $A*x=b$. To solve, you do $x=A^-1*b$. The inverse is $\frac{1}{det(A)}*Adj(A)$ (Adj is adjugate matrix)
	- Only works if A is a square matrix, and the determinant of A must not be 0.
- **Warm Data**: This is akin to metadata for emergent relationships within complex systems. Also akin to documentation for complex, designed spaces. However, I haven't seen any compelling case studies of how this effects irl change.
- **Medium Translation**: Is using AI to translate the SAME MESSAGE between mediums. At the limit, this is a huge translation, but also smaller translations are possible.... (i.e. ton + audience)
- **[Forecasting with LLMs](https://arxiv.org/html/2402.18563v1)**: A team at Berkeley is exploring using LLM agents to make systematic forecasts. An extremely interesting paper on using LLMs to forecase events used a RAG design to automatically search for relevant information and produce forecasts. The models were almost as good as the AGGREGATE of competitive forecasters, and beat it in some cases.
	- It seems like it could use deterministic code as a 'scratchpad' for predictions.
	- The RAG system allows it to get high quality data
- Simon Willison uses github's issues as a more narrative, second brain for projects.
	- The 'issues' and project scaffolding tracks developments and allows him to switch rapidly between tasks without long information loading phases (as all the information and decisions are stored chronologically).
	- Testing for myself with  [KLH Website](https://github.com/users/kam-hak/projects/2)
- **Setting up personal learning notes page/website**
	- I've set up a blog page for my website (kamranhakiman.com/blog), and improved the readability of the very simple website (e.g. limited the width of text to wrap at 800px). I'm doing coding by hand for muscle memory learning. 
	- Working with Claude and ChatGPT, I was able to produce an automated workflow which pulls from daily notes on my computer and automatically adds both the correct link into my website.
	- The actual program is in python. However, I'm pulling in both html and css. 
-  **Maths**
	- Binomial theorem: $(a + b)^n = \sum_{k=0}^n \binom{n}{k} a^{n-k} b^k$, note that $\binom{n}{k}=\frac{n!}{k!(n-k)!}$ is the binomial selection of n from k. 
	- Arithmetic sums solves as: $S_n = \frac{n}{2}*(a+l)$, where a is first term, l is last term, and n is the number of terms
		- Sigma notation: $S_n = \sum_{k=1}^{n} \left( a_1 + (k-1)d \right)$ -- here d is the amount of de/in-crementation
	- Geometric sum solves as: $S_n=a*\frac{1-(r)^n}{1-r}$, where $r$ is the ratio of interest and $a$ is the first time
		- Sigma notation: $S = \sum_{n=0}^{24} a \cdot (r)^n$
	- **Permutation vs. Combination** notation. $r$ are the events that we care about, and $n$ is the total number of possible events.
		- Permutations (order doesn't matter) are just the factorial of the n! / (n-r)!: $\frac{n!}{r!(n-r)!}$ or $_r P_n$ or $P(n,r)$
		- Combinations (order DOES matter) are the factorial of $\frac{n!}{r!(n-r)!}$ or $_r C_n$ or $C(n,r)$


---