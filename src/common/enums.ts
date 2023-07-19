export enum eResult{
    Success = 0,
    Error = -1,
    NotFound = -100
}

export enum SQLErrors {
    Login = 'ELOGIN',
    Timeout = 'ETIMEOUT',
    ALReadyConnected = 'EALREADYCONNECTED',
    ALReadyConnecting = 'EALREADYCONNECTING',
    InstLookup = 'EINSTLOOKUP',
    Socket = 'ESOCKET',
}

export enum OrderByDirection {
    Asc = 0,
    Desc = 1,
}

export enum DBConnectionStatus {
    Connected = 1,
    Disconnected = 0,
    Connecting = 2,
}
