az deployment sub create --template-file ../infra/azure.bicep --location westus \
    --parameters appName="Policy Management"  \
    --parameters uniqueName="policies01"