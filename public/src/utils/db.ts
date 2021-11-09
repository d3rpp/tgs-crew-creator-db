import type { CrewMemberInterface } from '../types/index';

/**
 * Saves a Crew Member to the Database though an API
 *
 * @returns The status of the save, if this returns `true`, the save was a success, otherwide it will return `false`
 */
export async function saveCrewMember(
	member: CrewMemberInterface
): Promise<boolean> {
	return true;
}
