/**
 * A Gender "TYPE", can only be "M" or "F"
 */
type Gender = 'M' | 'F';

/**
 * An Age Group Type, can be expanded later but for now only supports secondary school rowing
 *
 * Other clubs use "age" groups such as
 * 	-	Intermediate
 * 	- 	U19
 * 	-	U21
 * 	-	Champion (yes thats a thing)
 */
type AgeGroup = 'U15' | 'U16' | 'U17' | 'U18';

type BoatSize = 1 | 2 | 4 | 5 | 9;

export { Gender, AgeGroup, BoatSize };
