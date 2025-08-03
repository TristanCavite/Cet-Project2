<template>
    <main class="pb-4 bg-stone-200">
        <div class="relative flex items-center w-full border-b-2 font-playfair">
            <img src="/images/cet_administration.jpg" alt="" class="object-cover w-full h-44 md:h-128">
            <div class="absolute flex items-center top-28 md:top-40 left-6 md:left-[120px] h-10 w-72 md:h-28 md:w-96 bg-gray-700/90 ">
                <span class="pl-2 text-xl text-white md:pl-5 md:text-6xl">Facilities And Administration</span>
            </div>
        </div>

        <div class="flex flex-col items-center h-auto mx-auto mt-10 mb-12 border-2 shadow-2xl justify-centerw-full md:mt-16 md:w-304 bg-neutral-50">
            <div class="pt-10 pb-5 ml-5 border-b-4 md:ml-10 md:pt-16 w-80 md:w-144">
                <span class="text-2xl font-bold text-red-900 md:text-5xl font-playfair">FE Management Committee and Staff</span>
            </div>

            <!-- College Dean Section -->
            <div class="flex flex-col items-center justify-center mt-16 space-y-4 md:mt-40" v-if="collegeDean">
                <span class="text-xl font-semibold md:text-2xl font-montserrat">College Dean</span>
                <div class="flex flex-col items-center justify-center space-y-2 cursor-pointer" @click="showProfilePreview(collegeDean)">
                    <img :src="collegeDean.photo || '/placeholder.png'" class="object-cover h-24 transition shadow-lg w-28 md:h-56 md:w-72 rounded-xl hover:scale-105">
                    <span class="text-base font-bold">{{ collegeDean.name || "No Dean Assigned" }}</span>
                </div>
            </div>

            <!-- College Secretary Section -->
            <div class="flex flex-col items-center justify-center mt-16 space-y-4" v-if="collegeSecretary">
                <span class="text-xl font-semibold md:text-2xl font-montserrat">College Secretary</span>
                <div class="flex flex-col items-center justify-center space-y-2 cursor-pointer" @click="showProfilePreview(collegeSecretary)">
                    <img :src="collegeSecretary.photo || '/placeholder.png'" class="object-cover h-24 transition shadow-lg w-28 md:h-56 md:w-72 rounded-xl hover:scale-105">
                    <span class="text-base font-bold">{{ collegeSecretary.name || "No Secretary Assigned" }}</span>
                </div>
            </div>

            <!-- Department Heads Section -->
            <div class="grid grid-cols-3 pl-3 pr-3 mt-16 space-x-4 space-y-4 text-center" v-if="departmentHeads.length">
                <div class="flex justify-center col-span-3">
                    <span class="text-xl font-semibold md:text-2xl font-montserrat">Department Heads</span>
                </div>
                <div v-for="head in departmentHeads" :key="head.id" class="space-y-2 cursor-pointer" @click="showProfilePreview(head)">
                    <img :src="head.photo || '/placeholder.png'" class="object-cover h-24 transition shadow-xl w-28 md:h-56 md:w-72 rounded-xl hover:scale-105">
                    <span class="text-base font-bold">{{ head.name || "No Head Assigned" }}</span>
                </div>
            </div>

            <!-- Administrative Staff Section -->
            <div class="grid grid-cols-3 pl-3 pr-3 mt-16 space-x-4 space-y-4 text-center" v-if="adminStaff.length">
                <div class="flex justify-center col-span-3">
                    <span class="text-xl font-semibold md:text-2xl font-montserrat">Administrative Staff</span>
                </div>
                <div v-for="staff in adminStaff" :key="staff.id" class="flex flex-col space-y-2 cursor-pointer " @click="showProfilePreview(staff)">
                    <img :src="staff.photo || '/placeholder.png'" class="h-24 transition shadow-xl oobject-cover w-28 md:h-56 md:w-72 rounded-xl hover:scale-105">
                    <span class="font-bold">{{ staff.name || "No Staff Assigned" }}</span>
                    <span class="text-base text-gray-600">{{ staff.subDesignation || "N/A" }}</span>
                </div>
            </div>
        </div>

        <!-- Profile Preview Modal -->
        <div v-if="showProfilePreviewModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="w-4/5 max-w-3xl p-4 bg-white rounded-lg shadow-xl md:w-2/3 md:p-8">
                <div class="flex flex-col items-center justify-center text-center">
                    <img :src="selectedProfile?.photo || '/placeholder.png'" alt="Profile Picture" class="object-cover h-24 transition shadow-xl w-28 md:h-56 md:w-72 rounded-xl hover:scale-105">
                    <h2 class="mt-4 text-2xl font-bold text-maroon">{{ selectedProfile?.name || "No Name Provided" }}</h2>
                    <span class="text-lg font-semibold text-gray-500">{{ selectedProfile?.designation || "No Designation" }}</span>
                </div>
                <div class="mt-6 space-y-4 text-lg">
                    <div>
                        <span class="font-semibold text-maroon">Specialization:</span>
                        <span>{{ selectedProfile?.specialization || "N/A" }}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-maroon">Email:</span>
                        <span>{{ selectedProfile?.email || "N/A" }}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-maroon">Highest Educational Attainment:</span>
                        <span class="prose text-black" v-html="selectedProfile?.education || 'N/A'"></span>
                    </div>
                    <div>
                        <span class="font-semibold text-maroon">Websites:</span>
                        <div v-if="selectedProfile?.websites?.length">
                            <span v-for="(website, index) in selectedProfile.websites" :key="index" class="block text-blue-500 underline">
                                <a :href="website" target="_blank">{{ website }}</a>
                            </span>
                        </div>
                        <span v-else>No websites provided</span>
                    </div>
                </div>
                <div class="mt-6 text-center">
                    <button class="px-6 py-2 text-white rounded-lg shadow bg-maroon hover:bg-red-700" @click="closeProfilePreviewModal">Close</button>
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
