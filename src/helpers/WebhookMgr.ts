import _ from "lodash";
import { IDENTIFIER, CIRCLECI_URL } from "./config";
import { getRecord } from "./getRecord";
import { setExtensionFields } from "./setExtensionFields";

export class WebhookMgr {
  /**
   * Handles Webhook
   *
   * @param headers
   * @param payload
   */
  static webhookHandler = async ({ headers, payload }, { identifier, settings }) => {
    console.log(`===== Received CircleCI ${identifier} =====`);
    // console.log(`===== Received CircleCI Payload: ${payload} =====`);
    let fields: ICircleCIFields = {};
    //Accepts only brances that follow Aha! naming convention
    const reference = this.extractReference(payload.pipeline.vcs.branch);
    console.log("~~~~~branch name: " + reference)
    const record = await getRecord(reference.type, reference.referenceNum, false);
    if (reference) {
      const project = await record.getExtensionField(identifier, "project");
      const branches = await record.getExtensionField(identifier, "branches");
      const permalink = await record.getExtensionField(identifier, "permalink");
      fields.permalink = `${CIRCLECI_URL}/${payload.project.slug}`;
      fields.project = project || payload.project.name;
      const branchInfo = {
        branch: payload.pipeline.vcs.branch,
        type: payload.type,
        status: payload.workflow.status,
        happened_at: payload.happened_at,
        workflow: payload.workflow.name,
        commit: payload.pipeline.vcs.commit.subject,
        author: { name: payload.pipeline.vcs.commit.author.name },
        buildNum: payload.pipeline.number
      }
      //Update only if build type is "work-completed", excluding "job-completed"
      if (payload.type !== "workflow-completed") {
        return;
      }
      //If branch is array object
      if (_.isArray(branches)) {
        const branchIndex = _.findIndex(branches, (item) => {
          return item.branch === branchInfo.branch;
        })
        //If branch exists
        if (branchIndex >= 0) {
          fields.branches = [...branches]
          fields.branches[branchIndex] = {
            ...branches[branchIndex],
            happened_at: branchInfo.happened_at,
            commit: branchInfo.commit,
            author: { name: payload.pipeline.vcs.commit.author.name },
            buildNum: payload.pipeline.number
          }
        } else {
          fields.branches = [...branches ?? []];
          fields.branches.push(branchInfo);
        }
      } else {
        fields.branches = [branchInfo];
      }
      await setExtensionFields(record, fields, identifier);
    }

  };

  /**
   * Extract reference from branch name 
   * @param {string} name
  */
  static extractReference = (name: string): { type: IAhaReferenceType, referenceNum: string } => {
    let matches;

    // Requirement
    if ((matches = name.match(/[a-z]{1,10}-[0-9]+-[0-9]+/i))) {
      return {
        type: "Requirement",
        referenceNum: matches[0],
      };
    }
    // Epic
    if ((matches = name.match(/[a-z]{1,10}-E-[0-9]+/i))) {
      return {
        type: "Epic",
        referenceNum: matches[0],
      };
    }
    // Feature
    if ((matches = name.match(/[a-z]{1,10}-[0-9]+/i))) {
      return {
        type: "Feature",
        referenceNum: matches[0],
      };
    }

    return null;
  }

  constructor(private resource: ICircleCIResource, private payload: any, private identifier = IDENTIFIER) { }

}
