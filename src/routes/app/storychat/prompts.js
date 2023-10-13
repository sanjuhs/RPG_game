// this is a file that will contain all the prompts

//  XXXXXXXXXX---------- Hero Stats  ----------XXXXXXXXXX
//

export const example_stats_json = `
{ 
worldinfo: { fact1:"something" , ...other_facts} , 
active_quests: {quest1:"something" , ...},
done_quests: {quest1:"",...}
characters: { 
    hero:{ 
        name:"Drufen",
        level:1,
        XP: 250,
        xp_points_to_next_level: 3500,
        class:{
            type:"Swift Hunter",
            class_bonus:{
                Hit_Points:{
                    comment:" additonal 10",
                    change: 10,
                },
                strength:{
                    comment:"reduced by 25 as swift-hunter",
                    change:-25,
                },
                dextirity:{
                    comment:"multiplied by 2 as swift-hunter", 
                    change: 45,
                },
                ...other_stats
            },
        },
        skills:{
            cooking:5,
            running:15,
            ...other_skills
        },
        stats: { 
            Hit_Points:345, strength:17, dextirity:45 , ...other_stats , 
        },
        Inventory:{
            item: no_of_items,
            Mystical_Elf_Arrow:5,
            Letter_from_the_King:1,
        },
        status_effects:{
            energy_bar:{
                turns:2,
                change:{
                    Hit_Points: 3
                }
            }
        }
    },
    party_member_1:{
        name:"Lireal",
        level:1,
        XP: 250,
        xp_points_to_next_level: 3500,
        class:{
    },
    enemies:{
        name:"WildBoar" ,
        level: 15,
        class:{
            type:"boss_animal",
        },
        stats:{
            Hit_Points:450, strength:21, dextirity:3 , ...other_stats
        },
        status_effects:{
            ..
        }
    },
    } 
}
} 
`;

export const hero_stat_builder_system_prompt = `You are an expert RPG dungeon master BOT who updates the stats of hero and the world around him. You store relevant information from the world in JSON format 
and display important information such as stats and Inventory of the hero in the form of JSON. You usually structure your information in the schema of 
${example_stats_json} 
only add items to the inventory f they exist, if they are all used up and the number goes to 0 then remove them.
remember you do not need to add party members unless they explicitly join you. SImilarly you do not need to add the enemy unless its in combat. 
In case the enemy escapes or retrests or its HP goes to Zero the enemy will stay in combat. You do not need to take facts needless unless it is directly related to the quests or setting of the world.
Please Reply only in JSON.
`;

export const hero_stat_builder_user_prompt = `looking at the above begining of the story , please generate the hero stats for my hero Drufen. Also update the Inventory  Please Reply only in JSON.`;

//  XXXXXXXXXX---------- World Data  ----------XXXXXXXXXX
//
export const eiralia_worldData = `This is the mystical other worldly realm of Eiralia, where magical forests blend seamlessly into towering mountain ranges, where all is accepted from magic to might, from a variety of races from elves to orcs to humans , to many more. 
In the mystical realm of Eiralia, where magical forests blend seamlessly into towering mountain ranges, lies a secluded elven village known as StrafenFallVilage. 
Nestled at the base of the Whispering Waterfalls, this druidic haven is a sanctuary for all things natural. 
The community is led by High Druid Elira Moonshade, a wise elf who has lived for centuries and has a deep connection with the forest spirits. StrafenFallVilage is renowned for its enchanted gardens, where flora and fauna coexist in magical harmony.
`;

export const eiralia_starter = `

**Today, the village is abuzz with excitement; the annual Festival of the Emerald Leaves is about to commence. This festival celebrates the onset of autumn and is a time when druids from neighboring regions gather to exchange knowledge and partake in ancient rituals.**

**Amidst the backdrop of the Festival of the Emerald Leaves in StrafenFallVilage, a new figure walks into the elven enclave...**

You play as Drufen, a skilled human hunter, who steps through the mystical barriers, that shield the village from the outside world. Though the festival is a spectacle to behold, Drufen has little time for celebration. He's on a mission to find the best rum for King Miradas, a monarch from a neighboring human kingdom, and to deliver a concealed message to High Druid Elira Moonshade.

### Drufen's Entry ,

As Drufen enters the village, he's immediately captivated by its ethereal beauty. The moonlight dances on the surface of the Whispering Waterfalls, and magical lanterns float through the air, illuminating the ancient trees. But Drufen is a man of focus; he shakes off the allure of the surroundings and proceeds toward the village square, where a grand market is set up for the festival.
Stalls are abundant with exotic herbs, magical artifacts, and enchanted clothing. However, his eyes are set on a particular tent at the far end, adorned with various bottles and casks—this must be where the famed elven rum is sold.

### The Rum and the Message ..!

Finding the rum is only half the battle. Drufen also bears a sealed letter from King Miradas, a message meant for the eyes of High Druid Elira Moonshade. The contents of the message are unknown to him, but the wax seal of the king's sigil suggests its importance.

`;

//  XXXXXXXXXX---------- Story main  Prompts  ----------XXXXXXXXXX
//

export const storybuilder_prompt =
	'You are an expert RPG dungeon master and will help me build a story along the way as we go back and forth';

export const diceroll_rules = `A dice roll of 20 is apart of the game and happens whenever any action is taken. I will add the dice roll below my action every-time. Make sure to alter the outcomes of the actions based on the roll.
In the dice roll of 1-20, where a :
roll of 17 is good and roll of 18 and above is considered amazing and can actually lead to some amzing outcomes/ miracle level.
roll of 12 is neutral
roll of 7 or lower is bad  
roll of 2-3 or lower is very bad and disadvantageous / create a disaster /boost enemy, etc  depending on the action taken. 
`;

//  XXXXXXXXXX---------- Hero stats Updating ----------XXXXXXXXXX
//

//  the test phrases

export const testphrase1 = `lets get the moonshine now lads`;

export const testphrase_q1 = `I Go towrads the medows where an errie shop sells the best rum`;
export const testphrase_q2 = `before going any further i open my bag and pay the kind gnome with 100 gold for the rum i am left with only 10 gold now and 20 silver , I now am also a bit hungey si quickly i grab some eggs from my bag and make a small omlet near the village center and eat to gain a boost in mit points , i then make my way to the tavern once to see an old friend druid before meeting the highdruid Elira`;
