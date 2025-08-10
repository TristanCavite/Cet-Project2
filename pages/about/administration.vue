<template>
    <main class="relative pb-4 bg-neutral-100">
        <div class="relative flex items-center w-full border-b-2 font-playfair">
            <img src="/images/cet_administration.jpg" alt="" class="object-cover w-full h-44 md:h-128">
            <div class="absolute flex items-center top-28 md:top-40 left-6 md:left-[120px] h-10 w-72 md:h-28 md:w-auto bg-gray-700/90 ">
                <span class="pl-2 pr-2 text-xl text-white md:pl-5 md:pr-5 md:text-6xl">Facilities And Administration</span>
            </div>
        </div>
        <!-- main content -->
        <div class="flex flex-col items-center h-auto mx-auto mb-12 justify-centerw-full">
            <div class="flex flex-col pt-10 pb-5 ml-5 font-bold text-center md:ml-10 md:pt-16 w-80 md:w-144 font-playfair ">
                <span class="text-2xl text-red-900 md:text-5xl">Facutly of Engineering</span>
                <span class="text-xl text-gray-800 md:text-2xl">Management Committee and Staff</span>
            </div>

            <!-- College Dean Section -->
            <div class="flex flex-col items-center justify-center mt-16 space-y-4 md:mt-20" v-if="collegeDean">
                <span class="text-xl font-bold text-green-950 md:text-3xl font-roboto_condensed">COLLEGE DEAN</span>
                <div class="flex flex-col items-center justify-center p-5 space-y-2 bg-white shadow-xl cursor-pointer border-1 rounded-xl" @click="showProfilePreview(collegeDean)">
                    <img :src="collegeDean.photo || '/placeholder.png'" class="transition rounded-full object-fit hover:scale-105 md:size-64">
                    <span class="text-base font-medium">{{ collegeDean.name || "No Dean Assigned" }}</span>
                </div>
            </div>

            <!-- College Secretary Section -->
            <div class="flex flex-col items-center justify-center mt-16 space-y-4 md:mt-20" v-if="collegeSecretary">
                <span class="text-xl font-bold text-green-950 md:text-3xl font-roboto_condensed">COLLEGE SECRETARY</span>
                <div class="flex flex-col items-center justify-center p-5 space-y-2 bg-white shadow-xl cursor-pointer border-1 rounded-xl" @click="showProfilePreview(collegeSecretary)">
                    <img :src="collegeSecretary.photo || '/placeholder.png'" class="transition rounded-full object-fit md:size-64 hover:scale-105">
                    <span class="text-base font-medium">{{ collegeSecretary.name || "No Secretary Assigned" }}</span>
                </div>
            </div>

            <!-- Department Heads Section -->
            <div class="grid grid-cols-3 gap-5 pl-3 pr-3 mt-16 space-y-4 text-center md:mt-20" v-if="departmentHeads.length">
                <div class="flex justify-center col-span-3">
                    <span class="text-xl font-bold text-green-950 md:text-3xl font-roboto_condensed">DEPARTMENT HEADS</span>
                </div>
                <div v-for="head in departmentHeads" :key="head.id" class="p-5 space-y-2 bg-white shadow-xl cursor-pointer border-1 rounded-xl" @click="showProfilePreview(head)">
                    <img :src="head.photo || '/placeholder.png'" class="transition rounded-full object-fit md:size-64 hover:scale-105">
                    <span class="text-base font-medium">{{ head.name || "No Head Assigned" }}</span>
                </div>
            </div>

            <!-- Administrative Staff Section -->
            <div class="grid grid-cols-3 gap-5 pl-3 pr-3 mt-16 space-y-4 text-center" v-if="adminStaff.length">
                <div class="flex justify-center col-span-3">
                    <span class="text-xl font-bold text-green-950 md:text-3xl font-roboto_condensed">ADMINISTRATIVE STAFF</span>
                </div>
                <div v-for="staff in adminStaff" :key="staff.id" class="flex flex-col p-5 bg-white shadow-xl cursor-pointer border-1 rounded-xl" @click="showProfilePreview(staff)">
                    <img :src="staff.photo || '/placeholder.png'" class="transition rounded-full oobject-fit md:size-64 hover:scale-105">
                    <span class="font-medium">{{ staff.name || "No Staff Assigned" }}</span>
                    <span class="text-base text-gray-600">{{ staff.subDesignation || "N/A" }}</span>
                </div>
            </div>
        </div>

        <div v-if="showProfilePreviewModal">
            <profile-preview-modal  :profile="selectedProfile" @close="closeProfilePreviewModal"/>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

definePageMeta({
    layout: "custom",
    profile: {
        type: Object,
        required: true
    }
});
const emit = defineEmits(['close'])

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
