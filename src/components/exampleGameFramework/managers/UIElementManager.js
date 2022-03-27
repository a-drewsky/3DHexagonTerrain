
//Import UI Elements
import PixelButtonElementClass from "../uiElements/PixelButtonElement/PixelButtonElement";

export default class UIElementManagerClass {

   constructor(ctx) {
      this.ctx = ctx;

      this.elementMap = new Map();

      this.elementStates = {
         disabled: 'disabled',
         inactive: 'inactive',
         active: 'active',
         clicked: 'clicked'
      }
   }

   //Set Element States
   setDisabled = (elementName) => {
      this.elementMap.get(elementName).state = this.elementStates.disabled;
   }
   setInactive = (elementName) => {
      this.elementMap.get(elementName).state = this.elementStates.inactive;
   }
   setActive = (elementName) => {
      this.elementMap.get(elementName).state = this.elementStates.active;
   }

   //Delete Element
   deleteElement = (elementName) => {
      this.elementMap.delete(elementName);
   }

   //Set up function
   createElements = (canvas) => {
      this.elementMap.set("exampleButton", {
         element: new PixelButtonElementClass(this.ctx, "Example", 300, 300, 100, 50, 5, 2, `${canvas.width * 0.03}px Arial`),
         state: this.elementStates.disabled
      })
   }

}