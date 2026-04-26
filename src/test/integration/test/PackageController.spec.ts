import { DateUtils } from '@shared/utils/Date';
import { ResponseDto } from '../dtos/Reponse';
import { HttpClientBuilder } from '../http/ClientHttp';

describe('PackageControllerIntTest', () => {
	describe('CreatePackage', () => {

		it('should generate an order successfully', async () => {
			// Arrange
			const dayAfterTomorrow = DateUtils.addDays(new Date(), 2);
			const client = new HttpClientBuilder().withRequestBody({ date: dayAfterTomorrow.toISOString() },'order/generate', 'POST');
			// Act
			const response = await client.send();
			const data = response.data as ResponseDto<null>;
			// Assert
			expect(response).toBeDefined();
			expect(response.status).toBe(200);
			expect(data).toHaveProperty('isSuccess', true);
		});

		it('should create a package successfully', async () => {
			// Arrange

			const requestBody = {
				clientId: 1,
				recipeIds: [1],
				date: DateUtils.addDays(new Date(), 2)
			};
			const client = new HttpClientBuilder().withRequestBody(requestBody, 'package', 'POST');
			// Act
			const response = await client.send();
			const data = response.data as ResponseDto<null>;
			// Assert
			expect(response).toBeDefined();
			expect(response.status).toBe(200);
			expect(data).toHaveProperty('isSuccess', true);
		});

		it('should not create a package if client is not found', async () => {
			// Arrange
			const requestBody = {
				clientId: 999,
				recipeIds: [1, 2, 3],
				date: DateUtils.addDays(new Date(), 2)
			};
			const client = new HttpClientBuilder().withRequestBody(requestBody, 'package', 'POST');
			// Act
			const response = await client.send();
			const data = response.data as ResponseDto<null>;
			// Assert
			expect(response).toBeDefined();
			expect(response.status).toBe(404);
			expect(data).toHaveProperty('isSuccess', false);
			expect(data).toHaveProperty('error');
			expect(data.error).toHaveProperty('code', 'Client.NotFound');
		});

		it('should not create a package if one already exists for today', async () => {
			// Arrange
			const requestBody = {
				clientId: 1,
				recipeIds: [1],
				date: DateUtils.addDays(new Date(), 2)
			};
			const client = new HttpClientBuilder().withRequestBody(requestBody, 'package', 'POST');
			// Act
			const secondResponse = await client.send();
			const data = secondResponse.data as ResponseDto<null>;
			// Assert
			expect(secondResponse).toBeDefined();
			expect(secondResponse.status).toBe(409);

			expect(data).toHaveProperty('isSuccess', false);
			expect(data).toHaveProperty('error');
			expect(data.error).toHaveProperty('code', 'Package.AlreadyExists');
		});
	});
});
