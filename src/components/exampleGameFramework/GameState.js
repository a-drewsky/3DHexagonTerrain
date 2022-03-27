export default class GameStateClass {

   constructor(stateName, attributes, interval, intervalFrequency){
      this.stateName = stateName;

      if(attributes) for(let i in attributes) this[i]=attributes[i];

      this.interval = interval;
      this.intervalFrequency = intervalFrequency;
   }

}