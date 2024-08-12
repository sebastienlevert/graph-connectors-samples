extension microsoftGraph
param appName string
param uniqueName string

targetScope = 'subscription'

var graphAppId = '00000003-0000-0000-c000-000000000000'

func appRoleId(roleName string, roles array) string => filter(roles, r => r.value == roleName)[0].id

resource graphSp 'Microsoft.Graph/servicePrincipals@v1.0' existing = {
  appId: graphAppId
}
var graphAppRoles = graphSp.appRoles

resource appRegistration 'Microsoft.Graph/applications@v1.0' = {
  displayName: appName
  uniqueName: uniqueName
  signInAudience: 'AzureADMultipleOrgs'
  requiredResourceAccess: [
    {
      resourceAppId: graphAppId
      resourceAccess: [
        {
          id: appRoleId('ExternalConnection.ReadWrite.OwnedBy', graphAppRoles)
          type: 'Role'
        }
        {
          id: appRoleId('ExternalItem.ReadWrite.OwnedBy', graphAppRoles)
          type: 'Role'
        }
      ]
    }
  ]
  keyCredentials: [
    {
      displayName: 'Dev Cert'
      usage: 'Verify'
      type: 'AsymmetricX509Cert'
      key: loadFileAsBase64('cert/app.crt')
      
    }
  ]
}

// Create a service principal to grant admin consent
resource sp 'Microsoft.Graph/servicePrincipals@v1.0' = {
  appId: appRegistration.appId
}

resource externalConnectionReadWriteOwnedBy 'Microsoft.Graph/appRoleAssignedTo@v1.0' = {
  principalId: sp.id
  resourceId: graphSp.id
  appRoleId: appRoleId('ExternalConnection.ReadWrite.OwnedBy', graphAppRoles)
}

resource externalItemReadWriteOwnedBy 'Microsoft.Graph/appRoleAssignedTo@v1.0' = {
  principalId: sp.id
  resourceId: graphSp.id
  appRoleId: appRoleId('ExternalItem.ReadWrite.OwnedBy', graphAppRoles)
}

output AAD_APP_CLIENT_ID string = appRegistration.appId
