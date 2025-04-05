# Is the 'reverse population bomb' also a reverse *democracy* bomb?

## Research / Theory

### Is the 'reverse population bomb' a reverse *democracy* bomb?

There is significant discussion about a reverse population bomb, where the world's population (especially in richer countries) plummets. East asian countries such as China (due to state imposition), Japan, and S Korea are most often cited. Alice Evans asks why this is not a much bigger deal in policy circles, and whether everyone, but especially progressives, are massively *under-reacting* the possible decline.

Besides the demographic consequences, what does this mean for *regime types*? Especially, if neoliberalism and democracy have become intertwined (see @Riedl_2025_NeoliberalismThirdWave), **will the reverse population bomb be a reverse democracy bomb?** 

<img src="assets/Screenshot 2025-04-05 at 19.28.37.png" alt="Screenshot 2025-04-05 at 19.28.37.png" />

*Static regime projection model based on Freedom House classifications.*  
*UN Data (actual and projected) from: [world population prospects](https://population.un.org/wpp/downloads?folder=Standard%20Projections&group=Most%20used)*  
*Freedom House 1972-2024 data from: [freedom in the world comparative, historical data.](https://freedomhouse.org/report/freedom-world#Data)*  


In short, *kind of (?)*. Using an extremely simple approach, I simply look at the change in % of people living in Free, Partly Free, and Not Free countries according to Freedom House. This incorporates past regime type changes, but assumes that all countries are 'locked in' after 2024.

Its certainly not a bomb, but a meaningful decline as a percentage of population. This is almost entirely driven by rapid growth among 'partly free' countries, modest growth among 'not free' countries, and slowing reversing growth among democracies 

There is a decline in percentage of the population living in 'Free' countries (using Freedom House) (20.4% to 16.4%). Roughly 20% (-4pp). Interestingly, this is almost entirely going to 'Partly Free' countries going from 40.4 to 43.8%  (+8.4% or +3.4pp). 'Not Free' rises only slightly from 39.1% to 39.7%.

**Modernization theory's caveat**: Obviously, [modernization theory](https://en.wikipedia.org/wiki/Modernization_theory) would like a word with me. But, putting that aside, this gives a (vague) sense of how population change will shift what regimes humans live in. There is also increasing uncertainty about the trajectory of global development's beneficiaries in the coming decades given widespread xenophobic immigration rhetoric, challenges to export-led development, and AI's unclear impacts on labor value – e.g.  @Acemoglu_2023_PowerProgressOur and @Autor_2024_ApplyingAIRebuild convincingly argue that AI could help or decimate the laboring class depending on who designs its use. 

The past few years certainly give some credence to @Arendt_1959_HumanCondition's warning that human agency is not strictly bound by laws or rationalist accounts of individual or state actions (and certainly Trump tariff regime undercuts arguments notions presidents/individuals can't effect the economy or political trajectories unilaterally). 

Look at the [full data and interactive widget here](https://kamranhakiman.com/pop_regime_viz/index.html).

*Note: I wanted to use this as an opportunity to learn/vibe code a dynamic react page in a single day. Starting from raw data from the UN and Freedom House. This is certainly not a definitive analysis.*

## Tooling

### Building the react tool

- React is essentially just an abstraction of a webpage, where you can interactively 'update' only portions of it based on functions and classes
- This abstraction allowing the combining of html and javascript (JS) using the javascript XML(jsx). This is not a true language, but is compiled via Babel, turning it into true JS.
- In my react tool, I have a chart component (RegimePopulationChart). This being a component makes it reusable and modular (can be called and changed independently in code). 
- React, unlike vanilla JS, also has 'states', meaning I can re-render data and calculate it live. For instance, as a percentage or absolute data. I do this 'on click' in the page.

### Hosting react on github

- Hosting react is a pain to figure out (at least at first).
- It needs to be compiled from jsx into JS, it requires having a workflow which correctly shows the compiled version from a branch (rather than the main github branch) 
- `npm run deploy` creates the branch, in `~/react_page/dist/`
- `/.github/workflows/` is where you place custom workflows to understand how to properly parse the main vs. gh-pages branches.
- having npm installed by both `pip` and `brew` is also dangerous.