import { extractInitialsFromName } from "@/lib/utils/utils";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface InitialsOrAvartarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  userName?: string;
  avatarUrl?: string;
}

const InitialsOrAvartar: React.FC<InitialsOrAvartarProps> = ({
  userName,
  avatarUrl,
  className,
  ...props
}) => {
  return (
    <Avatar className={className} {...props}>
      <AvatarImage src={avatarUrl} alt="avatar" />
      <AvatarFallback>
        {extractInitialsFromName(userName || "Unknown")}
      </AvatarFallback>
    </Avatar>
  );
};

export default InitialsOrAvartar;
