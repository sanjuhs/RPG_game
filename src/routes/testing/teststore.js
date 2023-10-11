import { writable } from 'svelte/store';

export const testStore = writable({
	the_uid: null,
	name: null
});

// const example_json =
// {
// 	worldinfo: { fact1:"something" , ...other_facts} ,
// 	characters: {
// 		hero:{
// 			name:"Drufen",
// 			level:1,
// 			XP: 250,
// 			xp_points_to_next_level: 3500,
// 			class:{
// 				type:"Swift Hunter",
// 				class_bonus:{
// 					Hit_Points:{
// 						comment:" additonal 10",
// 						change: 10,
// 					},
// 					strength:{
// 						comment:"reduced by 25 as swift-hunter",
// 						change:-25,
// 					},
// 					dextirity:{
// 						comment:"multiplied by 2 as swift-hunter",
// 						change: 45,
// 					},
// 					...other_stats
// 				},
// 				skills:{
// 					cooking:5,
// 					running:15,
// 					...other_skills
// 				}
// 			},
// 			stats: {
// 				Hit_Points:345, strength:17, dextirity:45 , ...other_stats ,
// 			},
// 			Inventory:{
// 				item: no_of_items,
// 				Mystical_Elf_Arrow:5,
// 				Letter_from_the_King:1,
// 			},
// 			status_effects:{
// 				energy_bar:{
// 					turns:2,
// 					change:{
// 						Hit_Points: 3
// 					}
// 				}
// 			}
// 		},
// 		party_member_1:{
// 			name:"Lireal",
// 			level:1,
// 			XP: 250,
// 			xp_points_to_next_level: 3500,
// 			class:{
// 		},
// 		enemies:{
// 			name:"WildBoar" ,
// 			level: 15,
// 			class:{
// 				type:"boss_animal",
// 			},
// 			stats:{
// 				Hit_Points:450, strength:21, dextirity:3 , ...other_stats
// 			},
// 			status_effects:{
// 				..
// 			}
// 		},
// 		}
// 	}
// }
