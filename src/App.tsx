import React, {useCallback} from 'react';
import {Route, Routes} from "react-router";

import {Provider} from "react-redux";
import Home from "components/Home";
import City from "components/City";
import store from "./redux/store";
import NotPlayable from "./components/NotPlayable";
import NotifyContext from "./context/NotifyContext";
import useNotification from "./hooks/useNotification";
import {Alert, Snackbar} from "@mui/material";
import { GameModelContext } from 'context/GameModelContext';
import useSimulation from "./hooks/useSimulation";
import usePlayable from "./hooks/usePlayable";
import {NotifyTypeKey} from "./util";

function App() {

    const [
        notify,
        show,
        setKey,
        setShow
    ] = useNotification(NotifyTypeKey.EMPTY_NOTIFICATION)

    const isPlayable = usePlayable()

    const [model, setModel] = useSimulation()

    const handleClose = useCallback(() => {
        setShow(false)
        setKey(NotifyTypeKey.EMPTY_NOTIFICATION)
    }, [setKey, setShow])

    return (
        <>
            <Provider store={store}>
                <GameModelContext.Provider value={{ model, setModel }}>
                    <NotifyContext.Provider value={setKey}>
                        <Snackbar
                            open={show}
                            autoHideDuration={3000}
                            onClose={handleClose}
                            anchorOrigin={{
                                horizontal: 'center',
                                vertical: 'top'
                            }}
                        >
                            <Alert
                                onClose={handleClose}
                                severity={notify.notifySeverity}
                                sx={{width: '100%'}}
                            >
                                {notify.notifyMsg}
                            </Alert>
                        </Snackbar>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/game" element={isPlayable ? <City/> : <NotPlayable/>}/>
                        </Routes>
                    </NotifyContext.Provider>
                </GameModelContext.Provider>
            </Provider>
        </>
    );
}

export default App;
