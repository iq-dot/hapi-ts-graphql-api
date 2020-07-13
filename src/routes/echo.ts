import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import Hoek from '@hapi/hoek';

export default function setup(server: Hapi.Server): void {

  server.route({
    method: 'GET',
    path: '/echo/{word}',
    options: {
      validate: {
        params: Joi.object({
          word: Joi.string()
        })
      }
    },
    handler: (request) => {
      return `Echoing: ${Hoek.escapeHtml(request.params.word)}`;
    },
  });

}