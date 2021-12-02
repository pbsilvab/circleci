import React from "react";

export type AttributeCardProps = {
  branches?: IBranchType[];
};

export const IconText = (props: { icon: string; text?: string; style?: any; iconStyle?: any }) => (
  <span style={props.style ? { ...props.style } : {}}>
    <aha-icon icon={`${props.icon} type-icon`} style={props.iconStyle ? { ...props.iconStyle } : {}} />
    <span style={{ marginLeft: "5px" }}>{props.text}</span>
  </span>
);

const StatusIcon = (props: { status: boolean }) => {
  return (
    <>
      {props.status && (
        <IconText
          icon="fa-solid fa-check-circle"
          text="Success"
          style={{
            color: "#3eb268",
            backgroundColor: "#caf3d1",
            fontSize: "12px",
            padding: "2px 5px",
            borderRadius: "3px",
          }}
        />
      )}
      {!props.status && (
        <IconText
          icon="fa-solid fa-check-circle"
          text="Failed"
          style={{
            color: "red",
            backgroundColor: "#ffc0c0",
            fontSize: "12px",
            padding: "2px 5px",
            borderRadius: "3px",
          }}
        />
      )}
    </>
  );
};

const HoverCard = (props: { buildNum: number; workflow: string; commit: string; author: string }) => (
  <div
    style={{
      position: "absolute",
      background: "white",
      top: "-55px",
      boxShadow: "0px 0px 5px 1px #a5a5a5",
      padding: "10px",
      fontSize: "12px",
    }}
  >
    <aha-flex direction="column">
      <span>Build #: {props.buildNum}</span>
      <span>Workflow: {props.workflow}</span>
      <span>Commit: {props.commit}</span>
      <span>Author: {props.author}</span>
    </aha-flex>
  </div>
);

const AttributeCard = (props: AttributeCardProps) => {
  const [isHover, setIsHover] = React.useState(false);
  return (
    <div
      style={{
        // backgroundColor: "lightblue",
        flexGrow: 1,
        padding: "8px",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {props.branches.map((branch) => (
        <div
          style={{
            // backgroundColor: "var(--theme-tertiary-background)",
            display: "flex",
            justifyContent: "space-between",
          }}
          onMouseOver={() => {
            setIsHover(true);
          }}
          onMouseOut={() => {
            setIsHover(false);
          }}
        >
          <IconText
            icon="fa-regular fa-code-branch"
            text={branch.branch}
            style={{ fontSize: "12px" }}
            iconStyle={{ color: "#1082d5" }}
          />
          <StatusIcon status={branch.status === "success" ? true : false} />
          <IconText
            icon="fa-solid fa-clock type-icon"
            text={new Date(branch.happened_at).toDateString()}
            style={{ fontSize: "12px" }}
            iconStyle={{ color: "#1082d5" }}
          />
          {isHover && (
            <HoverCard
              buildNum={branch.buildNum}
              author={branch.author.name}
              commit={branch.commit}
              workflow={branch.workflow}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AttributeCard;
