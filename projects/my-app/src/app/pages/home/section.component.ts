import { Component } from '@angular/core';

@Component({
  selector: 'home-section',
  template: `
    <section class="py-24 bg-gray-50 text-gray-900">
      <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-center">Why Choose Lumina?</h2>
      <p class="text-center text-gray-600 mb-14 text-lg max-w-2xl mx-auto">
        Smart tools, trusted agents, and verified homes — everything to make your search effortless.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        <div class="p-8 rounded-2xl bg-white shadow-sm hover:shadow-md border border-gray-200 transition">
          <h3 class="text-xl font-semibold mb-3">Verified Listings</h3>
          <p class="text-gray-600">
            Every property is checked for quality, accuracy, and trustworthiness.
          </p>
        </div>
        <div class="p-8 rounded-2xl bg-white shadow-sm hover:shadow-md border border-gray-200 transition">
          <h3 class="text-xl font-semibold mb-3">Trusted Agents</h3>
          <p class="text-gray-600">
            Work with reliable, experienced agents who understand the market.
          </p>
        </div>
        <div class="p-8 rounded-2xl bg-white shadow-sm hover:shadow-md border border-gray-200 transition">
          <h3 class="text-xl font-semibold mb-3">Fast Support</h3>
          <p class="text-gray-600">
            We provide quick, clear, and helpful support whenever you need it.
          </p>
        </div>
      </div>
    </section>

    <section class="py-20 text-center text-black">
      <h2 class="text-3xl font-bold mb-4">Start Your Search Today</h2>
      <p class="mb-8 text-lg">Find your perfect home with ease and confidence.</p>
    </section>

    <section class="w-full bg-gray-50 py-16">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- CARD 1: Buy a home -->
          <div class="bg-white rounded-3xl shadow-md p-10 text-center">
            <h2 class="text-2xl font-bold mb-4">Buy a home</h2>
            <p class="text-gray-600 mb-6">
              A real estate agent can provide you with a clear breakdown of costs so that you can avoid surprise expenses.
            </p>
            <button class="px-6 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition">
              Find a local agent
            </button>
          </div>

          <!-- CARD 2: Loans -->
          <div class="bg-white rounded-3xl shadow-md p-10 text-center">
            <h2 class="text-2xl font-bold mb-4">Options</h2>
            <p class="text-gray-600 mb-6">
              Get pre-approved quickly and compare competitive  rates from trusted lenders to find the best financing option for your new home.
            </p>
            <button class="px-6 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition">
              Explore loan options
            </button>
          </div>

          <!-- CARD 3: Sell a home -->
          <div class="bg-white rounded-3xl shadow-md p-10 text-center">
            <h2 class="text-2xl font-bold mb-4">Sell a home</h2>
            <p class="text-gray-600 mb-6">
              No matter what path you take to sell your home, we can help you navigate a successful sale.
            </p>
            <button class="px-6 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition">
              See your options
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Section {}
