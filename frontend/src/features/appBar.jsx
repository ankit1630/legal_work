import React, { useState } from "react";

import "../styles/appbar.css";
import { Button, Popover } from "@mui/material";

import avatar from "./../images/avatar.jpg";

export const AppBar = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    
      const open = Boolean(anchorEl);
      const id = open ? 'simple-popover' : undefined;

    return (
        <div className="appbar">
            <div className="appbar-left">Hi, {props.userInfo.name}</div>
            <div className="appbar-right">
                <Button onClick={handleClick}>
                    <img className="avatar" src={avatar} alt="avatar" />
                </Button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    PaperProps={{
                        style: { width: '300px' },
                      }}
                >
                    <div className="appbar-userinfo">
                        <img className="avatar-popover" src={avatar} alt="avatar" />
                        <div className="appbar-userinfo-userdetail">
                            <h4 style={{"margin": "0", "margin-bottom": "8px"}}>{props.userInfo.name}</h4>
                            <div>{props.userInfo.email}</div>
                        </div>
                    </div>
                    <Button className="appbar-logout" onClick={() => props.onUserLogout()}>
                        Logout
                    </Button>
                </Popover>
            </div>
        </div>
    );
}