export const clientParsed = (u) => {
    if (!u) return null
    const keysList = u.ApiKeys || u.ApiKey || []
    return {
        clientId: u.id,
        clientName: u.name,
        clientUrl: u.url,
        clientEnabled: u.enabled,
        keys: keysList.map(a => ({
            apiKeyId: a.id,
            keyId: a.keyId,
            apiKeyEnabled: a.enabled 
        }))
    }
}
