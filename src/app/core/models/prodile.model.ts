import { Manager } from "./manager.model";
import { SuperManager } from "./super.manager.model";
import { TeamMember } from "./team.member.model";

export interface Profile {
    teamMember?: TeamMember;
    manager?: Manager;
    superManager?: SuperManager;
    avatar: string;
  }