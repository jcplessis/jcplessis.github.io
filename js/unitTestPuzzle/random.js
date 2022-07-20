function sfc32(a, b, c, d) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}

class RandomGenerator{
    constructor (seed){
        this.rand = sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed ^ 0xDEADBEEF);
    }
    
    randInt(min, max){
        return min + Math.round(this.rand() * max * 1000) % (max - min);
    }
    
    randChoice(list){
        var choice = this.randInt(0, list.length);
        return list[choice];
    }
}

assertEquals("RandomGenerator - Get one random float", 0.6294651087373495, new RandomGenerator(1337).rand());
r = new RandomGenerator(1337)
assertEquals("RandomGenerator - Get several random float", 0.6294651087373495, r.rand());
assertEquals("RandomGenerator - Get several random float", 0.4756935553159565, r.rand());
assertEquals("RandomGenerator - Get one random int", 47, new RandomGenerator(1337).randInt(10,100));
assertEquals("RandomGenerator - Get one random choice", 798, new RandomGenerator(1337).randChoice([12, 25, 798, 33]));
assertEquals("RandomGenerator - Get one random character", "d", new RandomGenerator(1337).randChoice("abcdef"));


