class Rule {
    constructor(description, test_function) {
        this.description = description;
        this.test_function = test_function;
    }
  
  is_green(input){
    if (this.test_function != undefined){
        return this.test_function(input);
    }
    return true;
  }
  
}

assertEquals("Rule has description", "rule desc", new Rule("rule desc").description);

function test_func (){ return "Maybe" } 
assertEquals("Rule has validation function", test_func, new Rule("rule desc", test_func).test_function);

assertEquals("Rule without test function is always green", true, new Rule("rule desc").is_green());
assertEquals("Rule with test function returns the test function result", "Maybe", new Rule("rule desc", test_func).is_green());

function identity(x){ return x } 
assertEquals("Rule should provide its input to the test function", "input", new Rule("rule desc", identity).is_green("input"));

class AtLeastOneBuilder {
    build(random_generator){
        var character = random_generator.randChoice("ABCDEF");
        return new Rule("Au moins un " + character,
            (input) => {return input.contains(character)}
        );
    }
}

rule = new AtLeastOneBuilder().build(new RandomGenerator(1337));
assertEquals("AtLeastOneBuilder - Build rule description", "Au moins un D", rule.description);
assertEquals("AtLeastOneBuilder - Check test function - false", false, rule.is_green(new Input(5,5)));
i = new Input(5,5)
i.set_element(0,1, "D")
assertEquals("AtLeastOneBuilder - Check test function - true", true, rule.is_green(i));

class ExactlyOneBuilder {
    build(random_generator){
        var character = random_generator.randChoice("ABCDEF");
        return new Rule("Exactement un " + character,
            (input) => {return input.count(character) == 1}
        );
    }
}

rule = new ExactlyOneBuilder().build(new RandomGenerator(1337));
assertEquals("ExactlyOneBuilder - Build rule", "Exactement un D", rule.description);
assertEquals("ExactlyOneBuilder - Check test function - false", false, rule.is_green(new Input(5,5)));
i = new Input(5,5)
i.set_element(0,1, "D")
assertEquals("ExactlyOneBuilder - Check test function - true", true, rule.is_green(i));
i.set_element(2,2, "D")
assertEquals("ExactlyOneBuilder - Check test function - false (several D)", false, rule.is_green(i));

class NeighbourBuilder {
    build(random_generator){
        var character = random_generator.randChoice("ABCDEF");
        var neighbour = random_generator.randChoice("ABCDEF");
        return new Rule("Un " + character + " à côté d'un " + neighbour + " (4 directions)",
            (input) => {return input.get_all_neighbours(character).includes(neighbour)}
        );
    }
}

rule = new NeighbourBuilder().build(new RandomGenerator(1337));
assertEquals("NeighbourBuilder - Build rule", "Un D à côté d'un E (4 directions)", rule.description);
assertEquals("NeighbourBuilder - Check test function - false", false, rule.is_green(new Input(5,5)));
i = new Input(5,5)
i.set_element(0,1, "D")
assertEquals("NeighbourBuilder - Check test function - still false", false, rule.is_green(i));
i.set_element(0,2, "E")
assertEquals("NeighbourBuilder - Check test function - now we're cooking ;)", true, rule.is_green(i));


class AboveBuilder {
    build(random_generator){
        var character = random_generator.randChoice("ABCDEF");
        var neighbour = random_generator.randChoice("ABCDEF");
        return new Rule("Un " + neighbour + " au dessus d'un " + character,
            (input) => {return input.get_aboves(character).includes(neighbour)}
        );
    }
}

rule = new AboveBuilder().build(new RandomGenerator(1337));
assertEquals("AboveBuilder - Build rule", "Un E au dessus d'un D", rule.description);
assertEquals("AboveBuilder - Check test function - false", false, rule.is_green(new Input(5,5)));
i = new Input(5,5)
i.set_element(0,1, "D")
assertEquals("AboveBuilder - Check test function - still false", false, rule.is_green(i));
i.set_element(1,1, "E")
assertEquals("AboveBuilder - Check test function - being on the right does not count !", false, rule.is_green(i));
i.set_element(0,0, "E")
assertEquals("AboveBuilder - Check test function - Above is good !", true, rule.is_green(i));


class BelowBuilder {
    build(random_generator){
        var character = random_generator.randChoice("ABCDEF");
        var neighbour = random_generator.randChoice("ABCDEF");
        return new Rule("Un " + neighbour + " sous un " + character,
            (input) => {return input.get_aboves(neighbour).includes(character)}
        );
    }
}

rule = new BelowBuilder().build(new RandomGenerator(1337));
assertEquals("BelowBuilder - Build rule", "Un E sous un D", rule.description);
assertEquals("BelowBuilder - Check test function - false", false, rule.is_green(new Input(5,5)));
i = new Input(5,5)
i.set_element(0,1, "D")
assertEquals("BelowBuilder - Check test function - still false", false, rule.is_green(i));
i.set_element(1,1, "E")
assertEquals("BelowBuilder - Check test function - being on the right does not count !", false, rule.is_green(i));
i.set_element(0,2, "E")
assertEquals("BelowBuilder - Check test function - Below is good !", true, rule.is_green(i));


class RightBuilder {
    build(random_generator){
        var character = random_generator.randChoice("ABCDEF");
        var neighbour = random_generator.randChoice("ABCDEF");
        return new Rule("Un " + neighbour + " à droite d'un " + character,
            (input) => {return input.get_rights(character).includes(neighbour)}
        );
    }
}

rule = new RightBuilder().build(new RandomGenerator(1337));
assertEquals("RightBuilder - Build rule", "Un E à droite d'un D", rule.description);
assertEquals("RightBuilder - Check test function - false", false, rule.is_green(new Input(5,5)));
i = new Input(5,5)
i.set_element(0,1, "D")
assertEquals("RightBuilder - Check test function - still false", false, rule.is_green(i));
i.set_element(0,0, "E")
assertEquals("RightBuilder - Check test function - being above does not count !", false, rule.is_green(i));
i.set_element(1,1, "E")
assertEquals("RightBuilder - Check test function - Right is good !", true, rule.is_green(i));

class LeftBuilder {
    build(random_generator){
        var character = random_generator.randChoice("ABCDEF");
        var neighbour = random_generator.randChoice("ABCDEF");
        return new Rule("Un " + neighbour + " à gauche d'un " + character,
            (input) => {return input.get_rights(neighbour).includes(character)}
        );
    }
}

rule = new LeftBuilder().build(new RandomGenerator(1337));
assertEquals("LeftBuilder - Build rule", "Un E à gauche d'un D", rule.description);
assertEquals("LeftBuilder - Check test function - false", false, rule.is_green(new Input(5,5)));
i = new Input(5,5)
i.set_element(2,1, "D")
assertEquals("LeftBuilder - Check test function - still false", false, rule.is_green(i));
i.set_element(2,0, "E")
assertEquals("LeftBuilder - Check test function - being above does not count !", false, rule.is_green(i));
i.set_element(1,1, "E")
assertEquals("LeftBuilder - Check test function - Left is good !", true, rule.is_green(i));

class HorseJumpBuilder {
    build(random_generator){
        var character = random_generator.randChoice("ABCDEF");
        var neighbour = random_generator.randChoice("ABCDEF");
        return new Rule("Un " + neighbour + " à un saut de cheval d'un " + character,
            (input) => {return input.get_horse_jumps(character).includes(neighbour)}
        );
    }
}

rule = new HorseJumpBuilder().build(new RandomGenerator(1337));
assertEquals("HorseJumpBuilder - Build rule", "Un E à un saut de cheval d'un D", rule.description);
assertEquals("HorseJumpBuilder - Check test function - false", false, rule.is_green(new Input(5,5)));
i = new Input(5,5)
i.set_element(0,1, "D")
assertEquals("HorseJumpBuilder - Check test function - still false", false, rule.is_green(i));
i.set_element(0,0, "E")
assertEquals("HorseJumpBuilder - Check test function - being above does not count !", false, rule.is_green(i));
i.set_element(2,0, "E")
assertEquals("HorseJumpBuilder - Check test function - Nice spot there !", true, rule.is_green(i));





class RulesGenerator {

    rule_builders = [
        new AtLeastOneBuilder(),
        new ExactlyOneBuilder(),
        new NeighbourBuilder(),
        new AboveBuilder(),
        new BelowBuilder(),
        new RightBuilder(),
        new LeftBuilder(),
        new HorseJumpBuilder()
    ]
    
    constructor(seed, rule_builders){
        this.random_generator = new RandomGenerator(seed);
        if(rule_builders != undefined) {
            this.rule_builders = rule_builders;
        }
    }
    
    generate_rule(){
        return this.random_generator.randChoice(this.rule_builders).build(this.random_generator);
    }
}

assertEquals("RulesGenerator - Get one random rule", "Au moins un E", new RulesGenerator(1337, [new AtLeastOneBuilder()]).generate_rule().description);

generator = new RulesGenerator(1337, [new AtLeastOneBuilder()])
assertEquals("RulesGenerator - Get two random rules 1/2", "Au moins un E", generator.generate_rule().description);
assertEquals("RulesGenerator - Get two random rules 2/2", "Au moins un C", generator.generate_rule().description);

