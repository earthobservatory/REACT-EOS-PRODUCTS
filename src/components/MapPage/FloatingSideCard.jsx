import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export const FloatingSidePeekCard = ({ children, isOpen, onClose }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        right: 0,
        zIndex: 9999,
        width: { md: "35vw", xs: "90vw" },
        // transform: "translateY(-50%)",
        transform: isOpen ? "translate(0, -50%)" : "translate(100%, -50%)",
        transition: "transform 0.3s ease-in-out",
        height: "60vh",
        // background: "rgba(235, 253, 255, 0.55)",
        background: "#32323288",
        borderRadius: "16px",
        boxShadow: " 0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(16px)",
        // border: "1px solid rgba(109, 240, 255, 0.29)",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
      }}
    >
      {/* <Fab
              color="primary"
              sx={{
                position: "fixed",
                top: "50%",
                left: 0,
                translate: "translateX(-50%)",
              }}
            >
              <ArrowForwardIcon />
            </Fab> */}
      {children}
    </Box>
  );
};
export const FloatingSideButton = ({ children, isOpen, onClick }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        right: -10,
        zIndex: 9999,
        // width: "",
        // transform: "translateY(-50%)",
        transform: isOpen ? "translate(100%, -50%)" : "translate(0, -50%)",
        transition: "transform 0.3s ease-in-out",
        // height: "60vh",
        // background: "rgba(235, 253, 255, 0.55)",
        background: "#32323288",
        borderRadius: "16px",
        boxShadow: " 0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(16px)",
        // border: "1px solid rgba(109, 240, 255, 0.29)",
        padding: "1rem",
      }}
    >
      <IconButton onClick={onClick}>
        <ChevronLeftIcon />
      </IconButton>
    </Box>
  );
};
