import { DateUtils } from '@shared/utils/Date';
import { ResponseDto } from '../dtos/Reponse';
import { HttpClientBuilder } from '../http/ClientHttp';

const toDateOnly = (date: Date): string => {
	return date.toISOString().slice(0, 10);
};

describe('OrderControllerIntTest', () => {
	describe('GenerateOrder', () => {
		//Create Order Test
		it('should generate an order successfully', async () => {
			// Arrange
			const today = toDateOnly(DateUtils.formatDate(new Date()));
			const client = new HttpClientBuilder().withRequestBody({ date: today }, '/api/kitchen/order', 'POST');
			// Act
			const response = await client.send();
			const data = response.data as ResponseDto<null>;
			// Assert
			expect(response).toBeDefined();
			expect(response.status).toBe(200);
			expect(data).toHaveProperty('isSuccess', true);
		});

		//should not create order if one already exists for today
		it('should not generate an order if one already exists for today', async () => {
			// Arrange
			const today = toDateOnly(DateUtils.formatDate(new Date()));
			const client = new HttpClientBuilder().withRequestBody({ date: today }, '/api/kitchen/order', 'POST');
			// Act
			const response = await client.send();
			const data = response.data as ResponseDto<null>;
			// Assert
			expect(response).toBeDefined();
			expect(response.status).toBe(409);
			expect(data).toHaveProperty('isSuccess', false);
			expect(data).toHaveProperty('error');
			expect(data.error).toHaveProperty('code', 'Order.AlreadyExists');
			expect(data.error).toHaveProperty('type', 3);
		});

		//should not create order if there are no recipes to prepare
		it('should not generate an order if there are no recipes to prepare', async () => {
			// Arrange
			const today = DateUtils.formatDate(new Date());
			const tomorrow = DateUtils.tomorrow(today);
			const client = new HttpClientBuilder().withRequestBody({ date: toDateOnly(tomorrow) }, '/api/kitchen/order', 'POST');
			// Act
			const response = await client.send<ResponseDto<null>>();
			const data: ResponseDto<null> = response.data;
			// Assert
			expect(response).toBeDefined();
			expect(response.status).toBe(404);
			expect(data).toHaveProperty('isSuccess', false);
			expect(data).toHaveProperty('error');
			expect(data.error).toHaveProperty('code', 'Order.NoRecipes');
			expect(data.error).toHaveProperty('type', 1);
		});

		it('should update the quantity prepared of an order item successfully', async () => {
			// Arrange
			const clientItem1 = new HttpClientBuilder().withRequestBody({ quantity: 1 }, '/api/kitchen/order/item/1/ready', 'PATCH');
			const clientItem2 = new HttpClientBuilder().withRequestBody({ quantity: 2 }, '/api/kitchen/order/item/2/ready', 'PATCH');
			// Act
			const response1 = await clientItem1.send<ResponseDto<null>>();
			const response2 = await clientItem2.send<ResponseDto<null>>();
			const data1: ResponseDto<null> = response1.data;
			const data2: ResponseDto<null> = response2.data;
			// Assert
			expect(response1).toBeDefined();
			expect(response1.status).toBe(200);
			expect(data1).toHaveProperty('isSuccess', true);
			expect(response2).toBeDefined();
			expect(response2.status).toBe(200);
			expect(data2).toHaveProperty('isSuccess', true);
		});
	});
});
