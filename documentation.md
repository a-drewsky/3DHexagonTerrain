# Hex Realms Development Processes

## Adding a New Unit

### Core Artwork
    1. Sketch out ideas and create a few sample animation frames
    2. draw spritesheets for walk, mine, idle, death and attack animations
        -Use Villager unit as an example

### Unit Configuration
    1. Create new folder for unit under images/units/<unit name>
    2. Add core spritesheets and unit icon image
    3. Create new image loader under units
    4. Add new imageLoader to base unitImages ImageLoader
    5. Add new entry in unitConfig and cardConfig