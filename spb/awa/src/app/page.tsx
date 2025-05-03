"use client";

import React, { useEffect, useState } from 'react';

import MainLayout from '@/components/layout/main-layout';
import StatCard from '@/components/ui/stat-card';
import { overviewStats } from '@/data/mock-data';
import { clubService, userService } from '@/services/api';

export default function Home() {
	const [totalUsers, setTotalUsers] = useState<number | null>(null);
	const [totalClubs, setTotalClubs] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdated, setLastUpdated] = useState<string>("Just now");

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				// Fetch total users with axios through userService
				try {
					const usersResponse = await userService.getUsers();

					console.log("Users API response:", usersResponse);

					// Extract total users count from the response
					if (usersResponse.success && usersResponse.data && usersResponse.data.total) {
						setTotalUsers(usersResponse.data.total);
					} else {
						console.warn("Could not find total users count in API response, using mock data");
						setTotalUsers(parseInt(overviewStats.clients.count.replace("k", "000")));
					}
				} catch (err) {
					console.error("Error fetching users:", err);
					setTotalUsers(parseInt(overviewStats.clients.count.replace("k", "000")));
				}

				// Fetch total clubs with axios through clubService
				try {
					const clubsResponse = await clubService.getClubs();

					console.log("Clubs API response:", clubsResponse);

					// Extract total clubs count from the response
					if (clubsResponse.success && clubsResponse.data) {
						// If the API returns an array, use its length as the total
						setTotalClubs(clubsResponse.data.total);
					} else {
						console.warn("Could not find clubs data in API response, using mock data");
						setTotalClubs(parseInt(overviewStats.clubs.count));
					}
				} catch (err) {
					console.error("Error fetching clubs:", err);
					setTotalClubs(parseInt(overviewStats.clubs.count));
				}

				// Set last updated time
				setLastUpdated(new Date().toLocaleTimeString());
			} catch (err) {
				console.error("Error in fetchData:", err);
				setError("Failed to fetch data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		// Refresh data every 5 minutes
		const intervalId = setInterval(fetchData, 5 * 60 * 1000);

		// Clean up interval on component unmount
		return () => clearInterval(intervalId);
	}, []);

	return (
		<MainLayout title="Overview">
			<div className="mb-4 flex items-center text-sm text-gray-500">
				<span>Last updated: {lastUpdated}</span>
			</div>

			{loading && !totalUsers && !totalClubs ? (
				<div className="flex justify-center items-center p-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
					<span className="ml-2">Loading statistics...</span>
				</div>
			) : error ? (
				<div className="bg-red-50 p-4 rounded-md text-red-500 mb-8">
					{error}
				</div>
			) : (
				<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
					<StatCard
						title="Users"
						value={totalUsers?.toLocaleString() || "0"}
						change={overviewStats.clients.change}
						color="blue"
					/>
					<StatCard
						title="Clubs"
						value={totalClubs?.toLocaleString() || "0"}
						change={overviewStats.clubs.change}
						color="red"
					/>
				</div>
			)}
		</MainLayout>
	);
}
