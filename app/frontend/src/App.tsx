import { h } from "preact"
import { CssBaseline, ThemeProvider} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";

import "./App.scss"
import { MainAreaRouter } from "./layout/MainAreaRouter"
import { AppMenuItemsContainer } from "./layout/AppMenuItemsContainer"
import { SidePanel } from "./side_panel/SidePanel"
import { ViewsBreadcrumb } from "./views/ViewsBreadcrumb"
import { DefaultTheme } from "./ui_themes/material_default"
import { ViewOptions } from "./views/ViewOptions"
import { StorageInfo } from "./sync/storage_type/StorageInfo"
import { UserInfo } from "./sync/user_info/UserInfo"
import { BackupInfo } from "./sync/sync_backup_info/BackupInfo"
import { SyncInfo } from "./sync/sync_backup_info/SyncInfo"

function App()
{
    return (
        <ThemeProvider theme={DefaultTheme}>
            <CssBaseline />
            <Box id="app" className="app">
                <Box component="header" zIndex={100}>
                    <AppBar position="static">
                        <Toolbar variant="dense" >
                            <ViewOptions />
                            <ViewsBreadcrumb />
                            <Box flexGrow={1} display="flex" justifyContent="flex-end" alignItems="stretch">
                                <Box mr={10} display="flex" flexDirection="column" alignItems="stretch">
                                    <BackupInfo />
                                </Box>

                                <Box mr={10} display="flex" flexDirection="column" alignItems="stretch">
                                    <SyncInfo />
                                </Box>

                                <Box mr={10} display="flex" flexDirection="column" alignItems="stretch">
                                    <StorageInfo />
                                </Box>

                                <Box display="flex" flexDirection="column" alignItems="stretch">
                                    <UserInfo />
                                </Box>

                            </Box>
                        </Toolbar>
                    </AppBar>
                </Box>
                <Box component="main" position="relative" zIndex={1}>
                    <Box id="app_content">
                        <MainAreaRouter />
                    </Box>
                    <Box component="aside" id="side_panel" bgcolor="#fafafa"  p={5} mt={1} position="relative" zIndex={10}>
                        <AppMenuItemsContainer />
                        <SidePanel />
                    </Box>
                </Box>
                <Box component="footer"></Box>
            </Box>
        </ThemeProvider>
    )
}

export default App
