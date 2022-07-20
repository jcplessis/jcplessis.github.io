rules = [new Rule("Top left corner is an A", (input) => input.get_element(0,0) == "A")]
i = new Input(5,10);
engine = new Engine(rules, i)

assertEquals("Functional test 1 - Empty input with rule is red", false, engine.is_green());
i.set_element(0,0, "A");
assertEquals("Functional test 1 - After completing the rule, engine is green", true, engine.is_green());

i.set_element(0,0, "B");
assertEquals("Functional test 1 - After changing an input that was needed by a rule, engine is red", false, engine.is_green());


rules = [new NeighbourBuilder().build(new RandomGenerator(1337))];
i = new Input(5,10);
engine = new Engine(rules, i)
assertEquals("Bug reproduction 1 - Rule is correct", "Un D à côté d'un E (4 directions)", rules[0].description);
assertEquals("Bug reproduction 1 - Empty input with rule is red", false, engine.is_green());
i.set_element(0,0, "D");
assertEquals("Bug reproduction 1 - Rule is still not complete", false, engine.is_green());
i.set_element(0,1, "E");
assertEquals("Bug reproduction 1 - Rule is complete", true, engine.is_green());




