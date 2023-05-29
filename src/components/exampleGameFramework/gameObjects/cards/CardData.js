
import CardBuilderClass from "../cards/CardBuilder";

export default class CardDataClass {

    constructor() {
        
        this.cards = []
        this.selectedCard = null

        this.cardBuilder = new CardBuilderClass()

    }

    //CARDS
    addCard = () => {
        if(this.cards.length==5) return
        if(this.cards.length>0 && this.cards[this.cards.length-1].flipped == true) return

        this.cards.push(this.cardBuilder.buildCard('villager_unit'))
    }

    flipCard = () => {
        this.cards[this.cards.length-1].flipped = false
    }

    removeCard = () => {
        if(this.selectedCard==null) throw new Error(`SELECTION ERROR - attempted to remove card when none are selected`)

        this.cards.splice(this.selectedCard, 1)
        this.selectedCard = null
    }

    scrapCard = (playerResources) => {
        if(this.selectedCard==null) throw new Error(`SELECTION ERROR - attempted to scrap card when none are selected`)

        for(let cost of this.cards[this.selectedCard].cost){
            playerResources[cost.resource] += Math.floor(cost.amount/2)
        }
        this.removeCard()
    }

    useCard = (playerResources) => {
        if(this.selectedCard==null) throw new Error(`SELECTION ERROR - attempted to use card when none are selected`)

        for(let cost of this.cards[this.selectedCard].cost){
            playerResources[cost.resource] -= cost.amount
        }

        this.removeCard()
    }

    canUseCard = (playerResources) => {
        for(let cost of this.cards[this.selectedCard].cost){
            if(playerResources[cost.resource] < cost.amount) return false
        }
        return true
    }

}