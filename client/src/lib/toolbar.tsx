import { Stack, Tooltip, IconButton, TextField } from "@mui/material";
import { ThemeSwitcher } from "@toolpad/core";
import SearchIcon from '@mui/icons-material/Search';
import { LinkContext } from "../ContextProvider";
import { useContext } from "react";

function ToolbarActionsSearch() {

    // const {linkList, setLinkList}  = useContext(LinkContext);
    const {linkList, setLinkList, refreshLinkList, setRefreshLinkList}  = useContext(LinkContext);

    let searchOnChangeHandler = () => {
        console.log("clicking on search !");
        refreshLinkList === true ? setRefreshLinkList(false) : setRefreshLinkList(true);
    }

    return (
      <Stack direction="row">
        <Tooltip title="Search" enterDelay={1000}>
          <div>
            <IconButton
              type="button"
              aria-label="search"
              sx={{
                display: { xs: 'inline', md: 'none' },
              }}
            >
              <SearchIcon />
            </IconButton>
          </div>
        </Tooltip>
        <TextField
          onChange={ () => { searchOnChangeHandler() } }
          label="Search"
          variant="outlined"
          size="small"
          slotProps={{
            input: {
              endAdornment: (
                <IconButton 
                  // FIXME: do not work if mobile view port
                  onClick={ searchOnChangeHandler }
                  type="button" aria-label="search" size="small">
                  <SearchIcon />
                </IconButton>
              ),
              sx: { pr: 0.5 },
            },
          }}
          sx={{ display: { xs: 'none', md: 'inline-block' }, mr: 1 }}
        />
        <ThemeSwitcher />
      </Stack>
    );
  }
  
  export { ToolbarActionsSearch };