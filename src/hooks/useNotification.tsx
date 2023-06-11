import {useEffect, useState} from "react";
import {NotifyType, NotifyHookType, NotifyStateType} from "../types/core.view";
import {NotifyTypeKey} from "../util";

/**
 * Értesítési kulcsok beszédes üzenetekkel
 */
const notifications: NotifyType[] = [
    {
        key: NotifyTypeKey.FILETYPE_ERROR,
        msg: 'A fájl típusa nem megfelelő! Kérjük JSON állománnyal próbálkozzon!',
        severity: 'error'
    },
    {
        key: NotifyTypeKey.PERSISTENCE_LOAD_ERROR,
        msg: 'A betölteni kívánt fájl sérült, vagy nem felel meg az elvárt formátumnak!',
        severity: 'error'
    },
    {
        key: NotifyTypeKey.DESTRUCTION_MODE_ON,
        msg: 'A romboló mód engedélyezve!',
        severity: 'warning'
    },
    {
        key: NotifyTypeKey.DESTRUCTION_MODE_OFF,
        msg: 'A romboló mód kikapcsolva!',
        severity: 'warning'
    },
    {
        key: NotifyTypeKey.ZONE_UPGRADE,
        msg: 'A zóna szintet lépett!',
        severity: 'success'
    },
    {
        key: NotifyTypeKey.ZONE_DEMOTE,
        msg: 'A zóna szintje visszafejlesztve!',
        severity: 'warning'
    },
    {
        key: NotifyTypeKey.OBJECT_COLLISION,
        msg: 'Erre a területre nem lehet építkezni!',
        severity: 'warning'
    },
]

/**
 * Az értesítések megjelenítését kezelő horog
 * - lekezeli az értesítések változtatását
 *
 * @param incomingKey a bejövő üzenet kulcsa, amit meg akarunk jeleníteni
 */
function useNotification(incomingKey: NotifyTypeKey): NotifyHookType{

    /**
     * Az eltárolt értesítés kulcsa
     */
    const [ key, setKey ] = useState<NotifyTypeKey>(incomingKey)

    /**
     * Megjelenítés állapota
     */
    const [ show, setShow ] = useState(false)

    /**
     * Az értesítés tulajdonságai
     */
    const [
        notify,
        setNotify
    ] = useState<NotifyStateType>({})

    /**
     * Változások kezelése
     */
    useEffect(() => {
        const notification = notifications.find(
            n => n.key === key
        )

        if(notification){
            setNotify({
                notifyMsg: notification.msg,
                notifySeverity: notification.severity
            })
            setShow(true)
        }
    }, [key])

    return [ notify, show, setKey, setShow ]
}

export default useNotification