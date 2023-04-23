import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const prompt = async (prompt) => {
  const completion = await openai
    .createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    })
    .catch((err) => {
      console.log(err)
      return 'ERROR'
    })

  const completion_text = completion.data.choices[0].message.content
  return completion_text
}

// openai
//   .createCompletion({
//     model: 'gpt-3.5-turbo',
//     prompt,
//   })
//   .then((res) => res.data.choices[0].text)

export const promptImage = (prompt, dim = '1024x1024') =>
  openai
    .createImage({
      prompt,
      n: 1,
      size: dim, // 896x912
    })
    .then((res) => res.data.data[0].url)

// try {

//   history.push([user_input, completion_text]);

//   const user_input_again = readlineSync.question(
//     "\nWould you like to continue the conversation? (Y/N)"
//   );
//   if (user_input_again.toUpperCase() === "N") {
//     return;
//   } else if (user_input_again.toUpperCase() !== "Y") {
//     console.log("Invalid input. Please enter 'Y' or 'N'.");
//     return;
//   }
// } catch (error) {
//   if (error.response) {
//     console.log(error.response.status);
//     console.log(error.response.data);
//   } else {
//     console.log(error.message);
//   }
// }
//   }
