declare interface IToken {
  access_token?: string;
  refresh_token?: string;
}

declare interface AvatarType {
  avatarType: "letter_avatar" | "upload";
  avatarUuid?: string | null;
}

declare type IAhaReferenceType = "Epic" | "Feature" | "Requirement";
declare interface IAhaReference { type: IAhaReferenceType; referenceNum: string }
declare type ICircleCIResource = "job-completed" | "workflow-completed";

declare type ICircleCIEventType = "workflow-completed" | "job-completed";

declare type ICircleCIEventStatus = "success" | "failed";

declare interface ICircleCIEventUser {
  name: string;
  image?: string;
}

declare interface IBranchType {
  type: ICircleCIEventType;
  status: ICircleCIEventStatus;
  branch: string;
  happened_at: Date;
  workflow: string;
  commit: string;
  author: ICircleCIEventUser;
  buildNum: number;
}
declare interface ICircleCIFields {
  project?: string;
  branches?: IBranchType[];
  permalink?: string;
}