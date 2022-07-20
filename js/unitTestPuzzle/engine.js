
class Engine{
    constructor(rules, input) {
        this.rules = rules;
        this.input = input;
    }
    
    is_green(){
        for(const rule of this.rules){
            if(! rule.is_green(this.input)){
                return false;
            }
        }
        return true;
    }
    
    get_rules_with_status(){
        var result = [];
        this.rules.forEach(rule => {
           result.push([rule.description, rule.is_green(this.input)]); 
        });
        return result;
    }
}

rules = [new Rule("test")]
i = new Input(5,10);
assertEquals("Engine - Take a list of rules", rules, new Engine(rules).rules);
assertEquals("Engine - Take a list of rules and an input", i, new Engine(rules, i).input);
assertEquals("Engine - Has a global status - is green", true, new Engine(rules, i).is_green());
assertEquals("Engine - Has a global status - is red", false, new Engine([new Rule("test"), new Rule("fail", () => false)], i).is_green());

assertObjectsEquals("Engine - Get rules with status", [["test", true]], new Engine(rules, i).get_rules_with_status());
assertObjectsEquals("Engine - Get rules with status with fail", [["test", true], ["fail", false]], new Engine([new Rule("test"), new Rule("fail", () => false)], i).get_rules_with_status());


