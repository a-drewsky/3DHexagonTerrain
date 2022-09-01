export default class GameStateClass {

   constructor(stateName, attributes){
      this.stateName = stateName;

      if(attributes) for(let i in attributes) this[i]=attributes[i];
   }

}