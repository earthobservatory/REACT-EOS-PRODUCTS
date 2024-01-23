import * as MaterialIcons from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function DynamicIconMUI({ iconName, ...props }) {
  const Icon = MaterialIcons[iconName];

  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
}

export function DynamicIconMUIButton({ iconName, ...props }) {
  return (
    <IconButton size="large" sx={{ mr: 2 }} {...props}>
      <DynamicIconMUI iconName={iconName} />
    </IconButton>
  );
}
