import React from "react";
function ProjectCard(props){
    return(
        <div onClick={()=>{
            props.handleProjectClick(props.userTable,props.name,props.id);
        }} className="project-card" style={{paddingLeft:"10px",float:"left"}}>
                <h3 style={{textAlign:"left"}}>{props.name}</h3>

                <div className="status" style={{display:"flex"}}>
                    <span className="active">Active Issues</span>
                </div>

                <div className="status" style={{display:"flex"}}>
                    <span className="done">Done Issues</span>
                </div>
        </div>
    );

}
export default ProjectCard;