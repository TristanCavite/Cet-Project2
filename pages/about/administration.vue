<template>
    <main class="pb-4 bg-stone-200">
        <div class="relative flex items-center w-full border-b-2 font-playfair">
            <img src="/images/cet_administration.jpg" alt="" class="object-cover w-full h-128">
            <div class="absolute flex items-center left-[120px] h-28 w-224 bg-gray-700 bg-opacity-90">
                <span class="pl-5 text-6xl text-white">Facilities And Administration</span>
            </div>
        </div>

        <div class="flex flex-col items-center justify-center h-auto mx-auto mt-16 mb-16 border-2 shadow-2xl w-384 bg-neutral-50 pb-14">
            <div class="pb-5 mt-16 ml-10 border-b-4 w-224">
                <span class="text-5xl font-bold text-red-800 font-playfair">CET Management Committee and Staff</span>
            </div>

            <!-- College Dean Section -->
            <div class="flex flex-col items-center justify-center mt-40 space-y-4" v-if="collegeDean">
                <span class="text-2xl font-semibold font-montserrat">College Dean</span>
                <div class="text-center cursor-pointer" @click="showProfilePreview(collegeDean)">
                    <img :src="collegeDean.photo || '/placeholder.png'" class="h-56 w-72 rounded-xl object-cover shadow-lg hover:scale-105 transition">
                    <p class="mt-2 font-bold">{{ collegeDean.name || "No Dean Assigned" }}</p>
                </div>
            </div>

            <!-- College Secretary Section -->
            <div class="flex flex-col items-center justify-center mt-16 space-y-4" v-if="collegeSecretary">
                <span class="text-2xl font-semibold font-montserrat">College Secretary</span>
                <div class="text-center cursor-pointer" @click="showProfilePreview(collegeSecretary)">
                    <img :src="collegeSecretary.photo || '/placeholder.png'" class="h-56 w-72 rounded-xl object-cover shadow-lg hover:scale-105 transition">
                    <p class="mt-2 font-bold">{{ collegeSecretary.name || "No Secretary Assigned" }}</p>
                </div>
            </div>

            <!-- Department Heads Section -->
            <div class="grid grid-cols-3 gap-16 mt-16" v-if="departmentHeads.length">
                <div class="flex justify-center col-span-3">
                    <span class="text-2xl font-semibold font-montserrat">Department Heads</span>
                </div>
                <div v-for="head in departmentHeads" :key="head.id" class="text-center cursor-pointer" @click="showProfilePreview(head)">
                    <img :src="head.photo || '/placeholder.png'" class="h-56 w-72 rounded-xl object-cover shadow-lg hover:scale-105 transition">
                    <p class="mt-2 font-bold">{{ head.name || "No Head Assigned" }}</p>
                </div>
            </div>

            <!-- Administrative Staff Section -->
            <div class="grid grid-cols-3 gap-16 mt-16" v-if="adminStaff.length">
                <div class="flex justify-center col-span-3">
                    <span class="text-2xl font-semibold font-montserrat">Administrative Staff</span>
                </div>
                <div v-for="staff in adminStaff" :key="staff.id" class="text-center cursor-pointer" @click="showProfilePreview(staff)">
                    <img :src="staff.photo || '/placeholder.png'" class="h-56 w-72 rounded-xl object-cover shadow-lg hover:scale-105 transition">
                    <p class="mt-2 font-bold">{{ staff.name || "No Staff Assigned" }}</p>
                    <p class="text-sm text-gray-600">{{ staff.subDesignation || "N/A" }}</p>
                </div>
            </div>
        </div>

        <!-- Profile Preview Modal -->
        <div v-if="showProfilePreviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-3xl">
                <div class="text-center relative">
                    <img :src="selectedProfile?.photo || '/placeholder.png'" alt="Profile Picture" class="w-32 h-32 rounded-full object-cover mx-auto shadow-lg">
                    <h2 class="mt-4 text-2xl font-bold text-maroon">{{ selectedProfile?.name || "No Name Provided" }}</h2>
                    <p class="text-gray-500 text-lg font-semibold">{{ selectedProfile?.designation || "No Designation" }}</p>
                </div>
                <div class="mt-6 space-y-4 text-lg">
                    <div>
                        <p class="font-semibold text-maroon">Specialization:</p>
                        <p>{{ selectedProfile?.specialization || "N/A" }}</p>
                    </div>
                    <div>
                        <p class="font-semibold text-maroon">Email:</p>
                        <p>{{ selectedProfile?.email || "N/A" }}</p>
                    </div>
                    <div>
                        <p class="font-semibold text-maroon">Highest Educational Attainment:</p>
                        <span class="prose text-black" v-html="selectedProfile?.education || 'N/A'"></span>
                    </div>
                    <div>
                        <p class="font-semibold text-maroon">Websites:</p>
                        <div v-if="selectedProfile?.websites?.length">
                            <span v-for="(website, index) in selectedProfile.websites" :key="index" class="block text-blue-500 underline">
                                <a :href="website" target="_blank">{{ website }}</a>
                            </span>
                        </div>
                        <span v-else>No websites provided</span>
                    </div>
                </div>
                <div class="mt-6 text-center">
                    <button class="bg-maroon text-white px-6 py-2 rounded-lg shadow hover:bg-red-700" @click="closeProfilePreviewModal">Close</button>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

definePageMeta({
    layout: "custom",
});

const db = getFirestore();
const collegeDean = ref(null);
const collegeSecretary = ref(null);
const departmentHeads = ref([]);
const adminStaff = ref([]);

const showProfilePreviewModal = ref(false);
const selectedProfile = ref(null);

// Fetch real-time faculty & staff data
const fetchCollegeFacultyStaff = () => {
    const docRef = doc(db, "college_faculty_staff", "college-wide");
    onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            collegeDean.value = data.collegeDean || null;
            collegeSecretary.value = data.collegeSecretary || null;
            departmentHeads.value = data.departmentHeads || [];
            adminStaff.value = data.adminStaff || [];
        }
    });
};

// Show profile preview modal
const showProfilePreview = (profile) => {
    selectedProfile.value = profile;
    showProfilePreviewModal.value = true;
};

// Close profile preview modal
const closeProfilePreviewModal = () => {
    showProfilePreviewModal.value = false;
    selectedProfile.value = null;
};

// Fetch the faculty & staff data on mount
onMounted(fetchCollegeFacultyStaff);
</script>

<style scoped>
.text-maroon {
    color: #740505;
}
.bg-maroon {
    background-color: #740505;
}
</style>
