import {
  createSlashCommandHandler,
  ApplicationCommand,
  InteractionHandler,
  Interaction,
  InteractionResponse,
  InteractionResponseType,
  EmbedType,
  ApplicationCommandOptionType,
} from '@glenstack/cf-workers-discord-bot'



function getUrl(data, requestedCamName) {
  return data.find(
    (cam) => {
      return requestedCamName === cam.cctv.location.locationName
    },
  ).cctv.imageData.static.currentImageURL
}



async function main() {
  let choices;

  let cams = await fetch("https://api.caltranscameras.app/")
  cams = await cams.json()

  cams.forEach((cam) => {
    choices.push({
      name: cam.cctv.location.locationName,
      value: cam.cctv.location.locationName,
    })
  })



  const cuteAnimal = {
    name: 'cam',
    description: 'Get a specific camera from Caltran\'s Database',
    options: [
      {
        name: 'camera',
        description: 'The name of the Camera',
        type: ApplicationCommandOptionType.STRING,
        required: true,
        choices: choices
      },
    ],
  }
  
  const cuteHandler = async (interaction) => {
    const userID = interaction.member.user.id
    const options = interaction.data.options
    const optionType = options && options[0].value
    const requestedCameName = (options && options[1] && options[1].value) || false
    const picUrl = getUrl(cams, requestedCameName)
  
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      content: `${picUrl}`
    }
  }



  const slashCommandHandler = createSlashCommandHandler({
    applicationID: '807286816532987906',
    applicationSecret: APPLICATION_SECRET, // You should store this in a secret
    publicKey: '62394bf3e9a8572b9aeb302aa7fb315095ec1305c80b9916babd5c2c6e202c44',
    commands: [[cuteAnimal, cuteHandler]],
  })
  
  addEventListener('fetch', (event) => {
    event.respondWith(slashCommandHandler(event.request))
  })


}


