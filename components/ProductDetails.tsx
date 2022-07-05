import { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import { classNames } from '../lib/utils';
import {
	ProductDetailsFragment,
	useCheckoutAddToCartMutation,
} from '../generated/graphql';
import Image from 'next/future/image';
import { formatMoney } from '../lib/format';
import { useCheckout } from '../lib/useCheckout';
import { useRouter } from 'next/router';

interface ProductDetailsProps {
	product: Omit<ProductDetailsFragment, 'description'> & {
		description: string | null;
	};
}

export function ProductDetails({ product }: ProductDetailsProps) {
	const [addToCart] = useCheckoutAddToCartMutation();
	const { token } = useCheckout();
	const router = useRouter();

	const handleBuy = async () => {
		if (!token || !product.defaultVariant?.id) {
			return;
		}

		const result = await addToCart({
			variables: { checkoutToken: token, variantId: product.defaultVariant.id },
		});

		if (result.errors?.length) {
			// @todo display this somehow
			console.warn(result.errors);
			return;
		}
		if (result.data?.checkoutLinesAdd?.errors?.length) {
			// @todo display this somehow
			console.warn(result.data?.checkoutLinesAdd?.errors);
			return;
		}

		router.push('/bag');
	};

	return (
		<div className="bg-white">
			<div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
				{/* Product */}
				<div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
					{/* Product image */}
					<div className="lg:row-end-1 lg:col-span-4">
						<div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
							{product.media?.[0] && (
								<Image
									src={product.media[0].url}
									alt={product.media[0].alt}
									className="object-center object-contain"
									priority={true}
								/>
							)}
						</div>
					</div>

					{/* Product details */}
					<div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-3">
						<div className="flex flex-col-reverse">
							<h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
								{product.name}
							</h1>

							<h2
								id="information-heading"
								className="sr-only"
							>
								Product information
							</h2>
						</div>

						{product.description && (
							<div
								className="prose mt-6"
								dangerouslySetInnerHTML={{ __html: product.description }}
							/>
						)}

						<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
							<button
								type="button"
								className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
								onClick={handleBuy}
							>
								Pay
								{/* @todo: pricing is null here, why? */}
								{product.pricing?.priceRange?.start?.gross &&
									formatMoney(
										product.pricing.priceRange.start.gross.amount,
										product.pricing.priceRange.start.gross.currency,
									)}
							</button>
						</div>

						<div className="border-t border-gray-200 mt-10 pt-10">
							<h3 className="text-sm font-medium text-gray-900">Share</h3>
							<ul
								role="list"
								className="flex items-center space-x-6 mt-4"
							>
								<li>
									<a
										href="#"
										className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
									>
										<span className="sr-only">Share on Facebook</span>
										<svg
											className="w-5 h-5"
											aria-hidden="true"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
									>
										<span className="sr-only">Share on Instagram</span>
										<svg
											className="w-6 h-6"
											aria-hidden="true"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												fillRule="evenodd"
												d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
									>
										<span className="sr-only">Share on Twitter</span>
										<svg
											className="w-5 h-5"
											aria-hidden="true"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
										</svg>
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-4">
						<Tab.Group as="div">
							<div className="border-b border-gray-200">
								<Tab.List className="-mb-px flex space-x-8">
									<Tab
										defaultChecked={true}
										className={({ selected }) =>
											classNames(
												selected
													? 'border-indigo-600 text-indigo-600'
													: 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
												'whitespace-nowrap py-6 border-b-2 font-medium text-sm',
											)
										}
									>
										Informacje o produkcie
									</Tab>
								</Tab.List>
							</div>
							<Tab.Panels as={Fragment}>
								{product.attributes.length > 0 && (
									<Tab.Panel className="text-sm text-gray-500">
										<h3 className="sr-only">Informacje o produkcie</h3>
										<dl>
											{product.attributes.map((attr) => {
												return (
													<Fragment key={attr.attribute.name}>
														<dt className="mt-10 font-medium text-gray-900">
															{attr.attribute.name}
														</dt>
														<dd className="mt-2 prose prose-sm max-w-none text-gray-500">
															{attr.values.map((value) => (
																<p key={value.id}>{value.name}</p>
															))}
														</dd>
													</Fragment>
												);
											})}
										</dl>
									</Tab.Panel>
								)}
							</Tab.Panels>
						</Tab.Group>
					</div>
				</div>
			</div>
		</div>
	);
}
