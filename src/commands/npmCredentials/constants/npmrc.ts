export const NPM_RC = {
  homedir: {
    base: ['; begin auth token', '; end auth token'],
    hapvida: [
      '//pkgs.dev.azure.com/hapvidalabs/DevOps/_packaging/HapvidaCoreAssistanceFrontend/npm/registry/:username=hapvidalabs',
      '//pkgs.dev.azure.com/hapvidalabs/DevOps/_packaging/HapvidaCoreAssistanceFrontend/npm/registry/:_password=',
      '//pkgs.dev.azure.com/hapvidalabs/DevOps/_packaging/HapvidaCoreAssistanceFrontend/npm/registry/:email=',
      '//pkgs.dev.azure.com/hapvidalabs/DevOps/_packaging/HapvidaCoreAssistanceFrontend/npm/:username=hapvidalabs',
      '//pkgs.dev.azure.com/hapvidalabs/DevOps/_packaging/HapvidaCoreAssistanceFrontend/npm/:_password=',
      '//pkgs.dev.azure.com/hapvidalabs/DevOps/_packaging/HapvidaCoreAssistanceFrontend/npm/:email=',
    ],
    voeazul: [
      '//pkgs.dev.azure.com/azuldevops/_packaging/azulframework/npm/registry/:username=azuldevops',
      '//pkgs.dev.azure.com/azuldevops/_packaging/azulframework/npm/registry/:_password=',
      '//pkgs.dev.azure.com/azuldevops/_packaging/azulframework/npm/registry/:email=',
      '//pkgs.dev.azure.com/azuldevops/_packaging/azulframework/npm/:username=azuldevops',
      '//pkgs.dev.azure.com/azuldevops/_packaging/azulframework/npm/:_password=',
      '//pkgs.dev.azure.com/azuldevops/_packaging/azulframework/npm/:email=',
    ],
  },
  project: {
    base: ['', 'always-auth=true'],
    hapvida: [
      'registry=https://pkgs.dev.azure.com/hapvidalabs/DevOps/_packaging/HapvidaCoreAssistanceFrontend/npm/registry/',
    ],
    voeazul: [
      'registry=https://pkgs.dev.azure.com/azuldevops/_packaging/azulframework/npm/registry/',
    ],
  },
} as const;
