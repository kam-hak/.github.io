# Clarifying Conflation: Science as <i>Ceteris Paribus</i>, Engineering as <i>Mutatis Mutandis</i>; Sequent Calculus; Ethical Hacking; Python Package Management

## Research / Theory

### Ceteris Paribus (science) and Mutatis Mutandis (engineering)

Engineering and (positivist) science are both rigorous disciplines, relying on verifiable, empirical 'ground-truth' in their pursuits. However, their functions are essentially inverse and complementary. This inverse is best captured in the Platonic ideal of each: for science this is *ceteris paribus* (all else equal) and for engineering this is *mutatis mutandis* (all necessary changes made). A spatial metaphor of 'a ladder of abstraction' is another way to think of this. Science seeks to 'go up' the ladder, gaining a general principle; engineering seeks to 'go down' the ladder of abstraction, *using* a general principle (relatively more) locally.

#### The distinct questions of each

I've stated that engineering and science have opposite functions, but not the question related. Engineering's question is:

>  "How can I *instantiation* theory into designs that *work*?".

Science's converse question is:

>  "How can I *abstract* theories from instantiated (i.e. existing) design that are *true* ?".  

#### Identity ≠ function

A common misunderstanding that scientists will think of themselves as doing science when they are doing something akin to engineering, or at minimum, doing a bit of both. Anytime a scientist asks if something *worked* to solve a problem, this is veering into an engineering question for how to solve problems in the world.

Of course, at a meta-level, most scientists can be thought of as engineers in the broadest sense, insofar as they design experiments or studies meant to solve the problem of causal identification. This could be in selecting case studies or laboratory experiments. The 'methods' scientists are taught are heuristics and theoretical principles, which they then instantiate into research **designs** – existing in an infinite design space – to solve the core problem of science, which is abstracting new theory based on inductive input. Conversely, engineers often *do* science, especially when their work is novel or innovative enough to be exploring new theory or codifying heuristics into more abstract knowledge. Many engineers, by training, have contributed tremendously to scientific theory, and vice versa.

However, a caution is needed. Just because the two can overlap, and can be tremendously reinforcing, the distinction between disciplines is still fundamental. If you develop new abstract theories *in pursuit* of instantiating a design to solve a problem, then you are doing science *in pursuit* of engineering. If you solve an engineering problem (e.g. build an electron collider to answer a scientific question), you are doing engineering *in pursuit* of science.

#### Heuristics as engineering's domain

Engineering is defined by *combinatorial explosion in the design and theory space*, while science fundamentally is not. Science isolates, while engineering adds. However, science is isolating *inductively*, meaning science is analyzing a finite and bound set of what exists, while engineering has no bound set. Engineering *draws on what could exist*. While this is technically infinite, it is practically *combinatorially explosive*, as engineers are typically constrained by variables they have identified and codified to add into design given a specific problem (e.g. a golf pencil *could* be designed to telescope to a functional baseball bat.... but that is extraordinarily out of most engineer's design-problem domain).

How do engineers deal with combinatorial explosion? Heuristics. **Heuristics are the 'cheat code' of engineering**, which allow for the useful application *of* scientific inquiry and knowledge to problems. Heuristics allow for non-deductive leaps from knowledge to application. This is necessary because scientific knowledge can *never* provide 'true' answers to a specific, concrete problem outside of an experiment. This sounds extreme, but it is justified. At its base, science is inductive. The application of science requires deductive leaps *from abstract categories*. However, knowing when these abstract leaps are justified; to what extent; and *in which circumstances* fundamentally relies on heuristics. It requires something like an OODA loop (observe, orient, decide, act), in which engineers use rules of thiumb to decide

#### Only heuristics can go *down* the ladder of Abstraction

The below graphic is from Radical Abundance via Farnam Street. It shows the 'flow of information' as going either up or down the ladder of abstraction. Going up is seeking *ceteris paribus*, it is removing information to distill something that generalizes across cases. Going down is the art of *mutatis mutandis*, which is knowing how to add things back in.

<img src="assets/Screenshot 2025-06-02 at 10.59.24 1.png" width="500" alt="Screenshot 2025-06-02 at 10.59.24 1.png" />

Concretely, @Cartwright_2012_EvidencebasedPolicyPractical discuss this ladder as the notion of a 'lever'. A hammer-claw and a see-saw both use the concept of leverage to solve problems (remove nails and lift [mostly] children through bouncing-collaboration). However, the concept of the lever is not sufficient to actualize either usage. Neither, of course, is the concept of a hammer-claw nor a see-saw. These are still abstract classes from instantiations of *specific* hammer-claws and see-saws. The specifics matter. A plastic hammer-claw may be able to work (and be better) for plastic nails, but would fail for sharp metal nail-heads, as the plastic is too soft. Likewise, a painted-metal see-saw may work well in temperate climates, but become far too hot for use in extremely hot climes. Here, you have design problems beyond simply the idea of a 'lever' or of the class of object 'hammer-claw'; 'see-saw'. This is

#### Design search is as heuristic bricolage

The challenge of going down is ≠ the challenge of going up. Going up requires removing local variation, to find higher-level invariants. Going down requires *knowing which* variation to put back in, and understanding how all that local variation works!

@Gavetti_2000_LookingForwardLooking distinguish two models of search within the design space for engineering. The first is **cognitive search**. Cognitive search is forward-looking, drawing on *both* scientific knowledge and problem-solving heuristics to help navigate the design space, deciding which of the infinite options to try next. That is, within the 'adjacent possible', what is the best design to try.  The other mode is **experiential search**, which is backward-looking and analogous to a 'test' in engineering. Here, you instantiate part of whole of a design to see whether something worked (as a modular unit of whole).

Science only plays a part in the first, cognitive search, as it provides mental models of how the physical and social world function. However, these mental models are abstractions, and thus an engineer must use a heuristic leap to apply them to a specific context. Again, the process of applying principles via *mutatis mutandis* is too combinatorially explosive to be perfectly deduced from science.

@Vincenti_1990_WhatEngineersKnow and @Koen_2003_DiscussionMethodConducting define engineering by the development of 'load bearing' heuristics, helping problem-solving designers to navigate the design space effectively. This is a craft, and can even be an art, which draws on scientific principles to make the previously impossible possible. However, these 'rules of thumb', no matter how load bearing, never become science itself. As they are not trying to be true, they are trying to be useful. Koen documents dozens.

Importantly, engineering as a discipline does generate and iteratively test heuristics, which are crucial guides for navigating the design space. However, they do not aim to be 'true' expressions of the world as it is, but useful, load-bearing assumptions for how to more quickly navigate the design space [@Koen_2003_DiscussionMethodConducting].

##### Abducing in engineering

I believe that engineering heuristics often rely on abduction to seek the *most likely* explanation for the failure of a test, which allows them to iterate in the design space effectively. This is neither the deduced from scientific abstraction, nor a  purely inductive move from observation to *test* a theory. Instead, it is seeking the best explanation of failure ( the best explanation for failure) and, from that, deducing a design that would fix it (based on best explanation, what should be tested next?).

#### Measurement ≠ science

Rigorous measurement has become extremely common in positivist social science, especially the use of econometrics and experimental designs. The application of these tools to the social realm has opened the door for a new style of policy *evaluations*. Many social scientists have made careers from learning to apply this measurement method to policy, in pursuit of both knowledge and working design.

Rigorous measurement is extraordinarily valuable to *both* science and engineering. For a scientist, it provides corroboration or falsification signal of theory, for an engineer, it provides diagnostic cues for whether the current design should be changed or kept.

A common rhetorical mistake made however is saying that a rigorous test states whether an intervention 'works'. This is erroneous. First, a test is only backward looking, it can only say whether a policy work***ed*** (past tense). Inference to the future is an abstraction requiring generalization in time. This requires theory, not simple gesture towards similarity.

Stating that a design will (not) work without theory means the relevant or irrelevant support factors for it to (not) work are unspecified as abstract concepts. Moreover, solving problems is not the domain of science. Engineering *as a discipline* was developed to provide guidance on how to accomplish this. Science only provides tools for going up the ladder. Going down is not the same problem, as scientists have no toolbox nor training for how to do this. This is not the same as saying they can't (scientists are smart and capable), but it is saying they have no competitive advantage nor training.

#### Slippage occurs on both sides, with science mostly encroaching

Both engineering and science domains often make slippage, but on balance, it seems that the claims of elements of work (in both engineering and in scientific domains) being *science* is most common. I believe this is because science has become intermingled with learning; whereas whether someone is learning for *theory* or *design* purposes, is the more correct distinction. Anytime someone applies a rigorous method to run a test, this is called science. However, if that test is of a *design* (and, it is *ad absurdum* to claim that a design test is a theory that 'my theory is that this design works'), then that is an engineering test. If it is, instead, meant to test a generalizable theory about causal laws, it is a scientific test.

Admittedly, there is a blurry boundary here, but many examples are *not* blurry. Lets talk about non-blurry first, then blurry ones.

##### Non-blurry: engineers [identity] claiming science, but actually design

A clear example of an engineering problem being *mis-interpreted* as science is the use of Science in the 'Lean Start-up' by Eric Ries. Ries advocates for quickly and efficiently find product-market fit (PMF) through iteration of a minimum viable product (MVP). The correct path for this is, according to his description, is to be scientific. That is, to run a number of 'tests' which determine whether your approach succeeds or fails. However, this is clearly not science. If science is the *abstraction* of laws from the specific to a wider category, what Ries is advocating is using *experiential search* (again, as described in @Gavetti_2000_LookingForwardLooking ) to navigate a rugged design space, where cognitive search (i.e. drawing on mental models) without 'ground truthing' is insufficient. A start-up is *not* trying to add to generalizable knowledge that a whole category of approaches 'works', but rather find their own product-market fit.  This is clearly design oriented, and a classic NK mapping familiar to @Kauffman_1993_OriginsOrderSelforganization's notion of finding local (or global; though that's unknowable) optima.

The canary in the coal mine, so to speak, is that Ries advises that a failed test can be *either* "persevere" or "pivot". This is not a paradigm of falsification, this is a paradigm of search. A scientific test (at least, a decisive one) *disproves* a theory. Gravity failing to operate would *disprove* gravity, and force a reconsideration of the theory itself. This is not at all the case for design. One can adapt the design of the MVP or business strategy enormously before giving up a concept entirely. If users are not signing up, there are dozens of options to try and rectify this (incentives; ads; UX re-work; technical audits). In (ideal) science, if your theory is wrong, you don't try to save it, you discard it. Of course, this gets more complex in probabilistic and especially social sciences, where concepts are too-often fuzzy, but the ideal stands.

##### Non-blurry: scientists [identity] claiming science, but actually design

Unfortunately, scientists *also* claim to be doing science when they are actually doing a design test, and therefore solving an engineering problem (what to design to solve X problem). The most ubiquitous example of this is social scientists applying 'science' to inform policy design. This is – nearly always – an oxymoron.

Science, by generating theory instead of design guidance, may update cognitive mental models (cognitive search), but it does not generally test *design*. That is, A/B testing is an engineering test (a 'unit test' in software engineering), which may have some scientific run-off (i.e. it can double-dip if it informs a wider class, going up the ladder of abstraction).

For instance, @Casey_2018_RadicalDecentralizationDoes asks "Does Community-Driven Development Work". Here, we *seem* to be asking about a class, and thus treating community-driven development (CDD) as a causal theory. However, it is clearly not. What is *the* theory of CDD? The question is nonsense. That is like asking what is *the* theory of a car. Both require a multi-tude of theories to work. They may have a theory of *change* (a car transports objects; CDD empowers people and efficiently allocates public goods), but this a mapping to solving a problem, not a causal theory. Both a car and CDD are very far down on the 'ladder of abstraction', in which many different theories are instantiated into a design and then enacted as artifacts in the real-world. A review of either cars or CDD (as large classes, with ≈infinite design potentials) can give guidance about their potential, but only a heuristic understanding of the response surface. It cannot 'disprove' nor 'prove' the *class*. Again, turning to physical engineering, it would have been unfortunate, and absurd, for Edison to claim his first (or hundredth) failed light-bulb design 'disproved' light-bulbs. This is equivalent to what asking "does X work?" as if it is a scientific, rather than engineering, question is attempting to do.

Perniciously, the *users* (policy-makers, practitioners) have become captured by this core misunderstanding. In dozens of meetings, with both government and practitioners, I've encountered requests for science to 'tell us what works', as if we were searching for scientific theory rather than learning to navigate a design space

Another analogy would be that policy practitioners are asking an analogous question to 'what kind of restaurants work?", is it Chinese, Scottish, or Ethiopian? No matter the statistical analysis (i.e. Chinese food may be most profitable on average), the question is wrong. Any of those *could* work and *could be most profitable*, much more important is all the decisions that go into creating a successful restaurant, such  as the quality of the cooking, sourcing of ingredients, advertising, staffing quality, location, and preferences of the local population. An aspiring restaurateur is not guaranteed success, failure, or any outcome by selecting the right class of interventions alone, success depends on how one navigates the high-dimensional design space. It is a *design* and therefore *engineering* problem, insofar as your restaurant is an artifact you are constructing to solve a problem (making money). A social intervention has the same logic. It does not succeed or fail due to selection of the correct class.

##### Blurry cases: when a test *also* speaks to a class

Blurry cases occur when a test of an artifact maps onto a theoretical question. This is quite difficult, but not impossible. There are two general cases of this a) when the causal process of a complex intervention is extremely well captured (i.e. structural modeling can be validated) and b) when the intervention is not complex and self-contained.

A complex process (instantiated in an artifact), if understood deeply, can provide theoretical leverage. For instance, @Enikolopov_2011_MediaPoliticalPersuasion exploit 'idiosyncratic' variation in access to independent TV in Russia in the lead-up to the 1999 elections, to test whether access to non-regime information shifts political behavior, they find a strong and persistent effect. This *does* answer (or, Popperian-ly, corroborate by failing to falsify the null) the scientific question of whether information effects political behavior. But, the relationship between scientific evidence and the engineering of an intervention is far from 1:1. This study does not say whether information interventions 'work'. Why? Because that is a design question.

Scientific studies based on complex interventions can test the *existence* of a theory, but they struggle enormously to disprove a theory. If @Enikolopov_2011_MediaPoliticalPersuasion had, conversely, found no effect, would it be reasonable to assume that *information has no effect*? Without knowing why the information had no effect, this would clearly be dubious. Their study only captures a single attempt to provide information in one context, and *even in that context* different information could that produced very different results (i.e. if the information was, credibly, that voting for the opposition party would instantly make you a millionaire; or, more realistically, perhaps if they had broadcast information at better times or with more charismatic hosts).

So, proving the positive is easier than negative the whole theory. What information would help them prove the negative? Likely, it would require them to have detailed, *process* information, proving that people received, understood, believed, and simply disregarded information. It would also require much more detailed information and limiting of the claim, such as specifying what type of informational treatment was being theoretically negated and scope conditions, etc.

A contrasting example is many of the psychological principles deployed by behavioral science or behavioral economics. Here, many of the principles are highly abstracted (e.g. loss aversion; salience), and very tightly bound. That is, they isolate a single variable in a design (e.g. changing a single word, or how far one needs to reach for cheese vs. broccoli on a salad bar). Notwithstanding the recent crisis of replication stemming from poor research practices, here the A/B testing is specified and carefully aligned so that the design difference and the theory of interests are extremely tightly linked. This makes if far easier to 'prove the negative', as reframing losing 1 USD to gaining 1 USD is very discrete and well-specified. As Lant @Pritchett_2017_EvidenceWhatWorks would say, this has strong construct validity. Thus, this provides actionable design guidance *and* scientific knowledge simultaneously, and with relatively equal inference weight between positive and negative findings.

## Tooling

### Sequent calculus + Logitext

- Sequent calculus (see: <http://logitext.mit.edu/tutorial>) is a logic form called 'proof calculus' designed for computerization. It states all the 'rules' of inference, and self-proves all statements which can be deduced from premises given rules. This is more natural for computers, which manipulate premises (hypotheses) using pre-specified functions logically, but is inverse of human language.
- First-order logic (FOL) is any logical argument which does not rely on defining classes which have properties at a higher level of abstraction. For instance, in FOL I can say that chartreuse is a color and that chartreuse is *a* weird color (as an object), but I cannot say that the property *color* is weird itself, as this is talking about a property abstracted from any object.  [What I'm trying to say is that chartreuse is a weird color].
 	- Put succinctly: if $x$ is an object and $P$ is a class,
  		- FOL allows: exists object or every object $x$ –  $\forall x \,/\, \exists x$
  		- SOL allows+: exists property or every property $P$: $\forall P \,/\, \exists P$
- NOTE: classical logic allows for proof by negation; however propositional intuitionist logic requires positively constructing the proof (never by negation).

### PicoCTF and 'ethical hacking'

- PicoCTF is an online 'game' for (ethical) hacking run by Carnegie Mellon University (CMU). They use it to identify and recruit high school students who are skilled at hacking. You join and compete as a team. The lead CMU professor will write a recommendation letter for you – to CMU or elsewhere – if you are a top team.  
- The conception of PicoCTF is a jeopardy-style contest, where teams select the difficulty and attempt to score the maximum points in an allotted time. This provides a strong signal of team strength overall.
- PicoCTF's main advantage is *scaffolded practice*. It houses an enormous, community generated practice set of questions meant to build discrete skills.
- This is reminiscent of the 'Primer' in Neal Stephenson's *The Diamond Age*, which gamifies and dynamically scaffolds an immersive learning system to the main character.
 	- [Andy Matuschak discusses the limitations](https://andymatuschak.org/primer/) of the Primer as a metaphor for education scaffolding, such as isolation, authoritarianism (the main character has little agency over what to learn), and an emphasis on fun over intention or meaning. PicoCTF addresses some of these limitations, through an emphasis on teams and the ostensible intention of developing ethical hackers. However, its scaffolding is not dynamic but user led.
 	- AI's of could dynamically re-write or re-factor problems to be at the *limit* of user ability.
- An 'easy' practice problem on PicoCTF was solvable by prompt injection ("server side template injection"), and required a basic but non-trivial understanding of Python.
- It seems certain that LLMs will increase the pressure on cybersecurity for two reasons:
 1. **Supply of amateur code with vulnerabilities**: Naive LLM users will begin building applications and sites with AI, often using original code for solved problems where a professional would know to use a 'best practice' packages or weathered components (meaning code stress tested for years across the internet and applications).
 2. **Supply of amateur hackers with new capacity**: Amateur hackers can now access a universe of exploits via LLMs. This will raise the baseline for what unethical hackers can accomplish, and also speed the rate of learning. LLMs *may* discover new zero-day hacks independently, but more likely is the capacity of hackers to find new zero-days is massively extended. Additionally, there is a perverse incentive for amateur hackers to take up the activity due to the increased amount of vulnerable code [see point 1].
- **Dilemma, Defense and offense are the same skillset**: *Blocking* the use of LLMs for hacking may be disastrous. Essentially, this would tie the hands of *both* ethical (white-hat) and unethical (black-hat) hackers. But, by definition, we would expect black-hat hackers to circumvent this restriction. Thus, we'd be handicapping primarily our defensive capacity, while barely slowly down our offensive.
 	- Superficially, this seems the same as 'good guy vs. bad guy' with a gun, but guns are (ghost-guns aside) not open sourced, require logistics chains, and we can easily provide guns to law enforcement selectively without breaking the supply pipeline for police (i.e. a police does not need to learn to use a gun in high school, college, and graduate school to become a police later -- you do need that for extensive training for ethical hacker).  

### Python package management –– uv(x), pip(x), and conda

- Conda prioritizes stability and reproducibility. All supported packages are distributions from conda ecosystem itself. This is the most sophisticated and consistent for managing across python and non-python packages.
 	- It verifies that the application binary interface (ABI) is consistent for each package and/or selects versions which solve for ABI.
 	- It verifies and does not 'trust' or use package wheels (a wheel, .whl, is a zip file which has pre-built an installation, pre-specifying the environment where it will install). Conda creates their own conda builds, so compatibility is assured if solved. This is critical when going outside pure Python ecosystem (e.g. CUDA, R), as the ABIs cannot be solved within the Python interpreter.
 	- Because conda is a separately managed community, 'cutting edge' packages and python versions come out later as a mini-distro, though often very fast. Conda is a closed garden operating system for python and system packages. It is particularly good for data science due to reproducibility.
- pip(x) is a package manager which solves exclusively based on trusting the wheels available for all packages. That is, it downloads packages meant for your environment. If no wheel is available, they follow the recipe from source.
 	- Two major differences: 1) pip does not 'see' your environment, so any OS/system changes will potentially break, and 2) pip does not check for ABI consistency *between* packages, this is primarily dangerous for packages running lower than the python interpreter (i.e. any operating in CPython, CUDA, etc).
 	- pipx (pip-executable install) is for making a python package executable from the command line (CLI), in an isolated venv.
- uv(x) has essentially identical functionality pip, but written in Rust and far more optimized (e.g. allowing paralleled downloads).
 	- uv dominates ~entirely. Always prefer uv.
- tldr; you can and should stack conda and uv.
 	- 1. **conda moves slow and doesn't break things**. It is stable, reproducible, and centralized, but less flexible, somewhat bigger on HD, and less 'cutting edge'. It should be prioritized especially for data science.
 	- 2. **uv(x) move fast(er) and can break things**. This is for function, not strict reproducibility and best for python only. Use uv for packages that are not yet released by conda-forge. Always use uv**x** for CLI executables.
