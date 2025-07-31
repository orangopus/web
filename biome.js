// Biome Simulation Core (Turing Complete Engine)
// Language: JavaScript (runs in Node.js or browser with small adaptation)

class Character {
  constructor(name, traits) {
    this.name = name;
    this.traits = traits; // { wisdom: 0-100, peace: 0-100, chaos: 0-100 }
    this.memory = [];
  }

  act(biome) {
    // Decision logic based on traits
    if (this.traits.wisdom > 70) {
      biome.changeState('ancient_magic');
      this.memory.push("Invoked ancient magic");
    } else if (this.traits.peace > 70) {
      biome.changeState('harmony');
      this.memory.push("Fostered peace");
    } else if (this.traits.chaos > 70) {
      biome.changeState('rebellion');
      this.memory.push("Started rebellion");
    }
  }
}

class Shrew {
  constructor() {
    this.timeline = [];
  }

  observe(character, biome) {
    const snapshot = {
      character: character.name,
      memory: [...character.memory],
      biomeState: biome.state
    };
    this.timeline.push(snapshot);
  }
}

class Biome {
  constructor() {
    this.state = 'neutral';
    this.history = [];
  }

  changeState(newState) {
    this.state = newState;
    this.history.push(newState);
  }
}

// Setup characters
const gandalf = new Character("Gandalf", { wisdom: 95, peace: 50, chaos: 20 });
const gandhi = new Character("Gandhi", { wisdom: 80, peace: 90, chaos: 10 });
const brat = new Character("Brat Pack Kid", { wisdom: 40, peace: 20, chaos: 85 });

// Setup simulation
const biome = new Biome();
const shrew = new Shrew();

// Run simulation step
const characters = [gandalf, gandhi, brat];
for (const char of characters) {
  char.act(biome);
  shrew.observe(char, biome);
}

// Output results
console.log("Biome State:", biome.state);
console.log("Biome History:", biome.history);
console.log("Shrew Timeline:", shrew.timeline);