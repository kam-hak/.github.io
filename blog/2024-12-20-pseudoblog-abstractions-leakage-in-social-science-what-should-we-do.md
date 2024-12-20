# Pseudoblog: Abstractions Leakage in Social Science -- What should we do?

##  Research / Theory

### Social science abstractions 'leak' - what should we do?

> 	*Abstractions are vital, but like many living things, dangerous, because [abstractions always leak](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/). (“You’re very clever, young man, but it’s reductionism all the way down!”) This is in some sense the opposite of a mathematician: a mathematician tries to ‘see through’ a complex system’s accidental complexity up to a simpler more-abstract more-true version which can be understood & manipulated—but for the hacker, all complexity is essential, and they are instead trying to* un*see the simple abstract system down to the more-complex less-abstract (but also more true) version. (A mathematician might try to transform a program up into successively more abstract representations to eventually show it is trivially correct; a hacker would prefer to compile a program down into its most concrete representation to [brute force all execution paths](/forking-path) & find an exploit trivially proving it incorrect.* /// from Gwern's excellent [On Seeing Through and Unseeing: The Hacker Mindset](https://gwern.net/unseeing))

- At its core, (positivist) science develops abstractions which attempt to regularize and explain the world. However, abstractions always leak, and points of leakage point to two things:
	1. Leakage provides fodder and guidance on new scientific paradigms [@Kuhn_1996_StructureScientificRevolutions], which are spurred on by accumulated, unexplained anomalies (e.g. Newtonian physics slightly misrepresents Mercury's orbit).
	2. Leakage allows *hackers* to *un*see the abstraction , to find novel uses of existing components. Hacking here can be hostile or benign, but must include unintended uses as understood by the designer(s).
- **Social science, more than the natural sciences, is plagued by leakages across distinct areas of abstraction**. Leaky abstraction occurs across defining *both* cause (e.g. ego depletion) and effect (e.g. task effort). More so than natural science, social science also suffers from weak feedback mechanisms for when theories do not bear out in the real world, *due to leakage*.
	- If a natural science concept is meant to predict a measurable outcomes (e.g. mechanical engineering ensures a car's brake works), it is generally obvious when the brakes encounter a condition where they fail. Because braking has very well defined, and generally low leakage theoretical basis, identifying the causes of failure in a breaking system requires identifying a *relative* manageable number of possible failures.
- **Leakage is multi-faceted and dynamic in social science, exactly because the entities it applies to have a agency.** Take the example of social science operationalized into an 'intervention', such as a village savings program meant to overcome poverty traps and draw on social trust / embeddedness. It is far more difficult to isolate the where the 'leakage' is occurring in the system when it fails. Why might this be? 
	1. Even a relatively simply village savings program will have *very* different personalities in it between contexts. 
	2. Abstract categories such as gender, age, income, education, etc., which we can control for or directly manipulate via selection are thin conceptions of much more complex socio-economic realities. 
	3. The *implementation* of the same model will vary dramatically not only by organization, but within the same organization over space
	4. The category of a 'village savings program' has far too many degrees of freedom to meaningfully ask what its effect is, *and these degrees of design freedom are unspecified*.
	5. Organizations *and communities* attempt to 'hack' the abstract design of programs in both benign or hostile ways. They do this by looking below the abstract rules, for how they can manipulate the program for their own purposes.
		- An implementer may navigate degrees of freedom in pursuit of *either/both* more impact (possibly increasing effort) or less effort (possibly lowering impact). This depends on the implementer's intrinsic and extrinsic motivations. Extrinsic motivation pushes towards hacking institutional rules for less effort (even with lower impact) and intrinsic for the opposite.
		- Communities seek to 'hack' program designs by nominally complying or participating, while safeguarding groups' interest or power. For instance, measuring the attendance of a marginalized group (e.g. youth) is an *abstraction* meant to capture empowerment and political participation. However, communities may strictly control or monitor the youth, to functionally render their attendance inert. Likewise, a powerful leader may seek to have his/her children become informal or formal leaders of these participatory spaces, capturing them while never *directly* interfering.
		- Finally, *both* implementers and communities may see that the rules are 'held up' by rules outside of the formal institution. They don't need to engage with the design at all. For instance, instead of manipulating a rule, they may just bribe the implementer or government (just as a burglar may ignore a triple-locked door and break a nearby window).
	6. Implementing organizations and communities *learn* to 'hack' institutions more effectively over time. Fundamentally, the subjects of natural science (even animals, for the most part) are unaware of the laws which dictate their lives, and do not actively seek *knowingly* to reinterpret them (taking evolutionary learning as random walk exploration).
- **We *want* program implementers to be 'white-hat' hackers**, to understand both the abstract representation of interventions, and to actively block routes for hostile hackers (whether in communities or implementing bodies). Fundamentally, this relies on two things:
	1. Building and maintaining the intrinsic motivation of mission-driven implementers [@Honig_2022_ManagingMotivationPublic], and
	2. Giving implementers a wide degrees of discretion to navigate by judgement [@honig2018navigation].
- **Social science may learn the exact wrong lesson without addressing leakage.** Perhaps most controversially, empirical social science should promise far less in attempting to answer questions where the abstract concepts are inherently leaky across *both* the cause and effect measured (e.g. any paper which asks whether social cohesion does X, or participatory budgeting does Y is fundamentally asking an unanswerable question). *These papers are using a point (a single combination of design elements), or even a set of points, to attempt to describe an intrinsically non-ordered line (all possible combinations)*. 
	- **Rejecting all potential points on a line due to a point being null is a fundamental class error.** The theory may still hold true, but a particular design did not work due to the many different leakage possibilities. That *same* design may work under different circumstances, or it may fail but in a different way. Again, this is due to the immense agency of both implementers and communities.


## Tooling
### Reviewing Differentiation (cont.)

- **Using natural log to remove exponents**: because $ln(a^b)=b*ln(a)$, you can natural log both sides of an equation to handle tricky exponents prior to differentiation (e.g. $x^{ln(x)}$). 
	- **General log differentiation**: $\dfrac{d}{dx}​log_b​(u(x))=\dfrac{u'(x)}{ln(b)u(x)}​$  
	- **Natural log differentiation**: $\dfrac{d}{dx}\ln(u(x))=\dfrac{u'(x)}{u(x)}$

### Implicit differentiation

- Implicit differentiation is typically used when variables cannot be expressed as a function of one another, but there is a relationship via an equation (e.g. $x^2+y^2=1$). Typically, this requires the chain rule to solve without isolating one variable and substituting.
### Acceleration + velocity

- Velocity is the first derivative of position, while acceleration is the second.
	- Velocity $(v)$ is the derivative of position $(s)$ with respect to time $(t)$:
$$v(t) = \frac{ds}{dt}$$
	- Acceleration $(a)$ is the derivative of velocity (so $d^2s/dt^2$): $$a(t) = \frac{dv}{dt} = \frac{d^2s}{dt^2}$$

### Linear approximation
- Approximating the tangent line is given by adding the output of the function to the *product* of the derivative at that point plus the distance between x (the new point) and (the independent variable at point of tangency). $$L(x) = h(a) + h'(a)(x-a)$$



---