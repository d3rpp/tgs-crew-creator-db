/**
 * A Gender "TYPE", can only be "M" or "F"
 */
type Gender = "M" | "F";

/**
 * An Age Group Type, can be expanded later but for now only supports secondary school rowing
 * 
 * Other clubs use "age" groups such as
 * 	-	Intermediate
 * 	- 	U19
 * 	-	U21
 * 	-	Champion (yes thats a thing)
 */
type AgeGroup = "U15" | "U16" | "U17" | "U18";

type BoatSize = 1 | 2 | 4 | 8 | 0;

//#region CrewMemberEditor

/**
 * The Main Crew Member Class, used by multiple file as a common dependency, allows for consistency between pages
 */
class CrewMember {
	id!: number;
	name!: string;
	gender!: Gender;
	ageGroup!: AgeGroup;
	novice!: boolean;

	public constructor(i: CrewMemberInterface);
	public constructor(id: number, name: string, gender: Gender, ageGroup: AgeGroup, novice: boolean);
	public constructor(...args: any[]) {
		if (args.length == 1) {
			this.fromInterface(args[0]);
		}
		else if (args.length == 5) {
			this.fromValues(args[0], args[1], args[2], args[3], args[4]);
		} else {
			throw new Error("Crew Member incorrectly initialised");
		}
	}

	private fromInterface(i: CrewMemberInterface) {
		this.id = i.id!;
		this.name = i.name!;
		this.gender = i.gender as Gender;
		this.novice = i.novice!;
		this.ageGroup = i.ageGroup as AgeGroup;
	}

	private fromValues(id: number, name: string, gender: Gender, ageGroup: AgeGroup, novice: boolean) {
		this.id = id;
		this.name = name;
		this.gender = gender;
		this.novice = novice;
		this.ageGroup = ageGroup;
	}

}

/**
 * An Interface for the CrewMember Class, it is possible to create a Crew Member from this interface
 * 
 * the solution looks a bit scuffed but it is literally in the documentation for typescript to go off i guess
 */
interface CrewMemberInterface {
	id?: number | undefined;
	name?: string | undefined;
	gender?: Gender | string;
	ageGroup?: AgeGroup | string;
	novice?: boolean | undefined;
}

//#endregion


export { CrewMember, CrewMemberInterface, Gender, AgeGroup, BoatSize }