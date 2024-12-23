<template>
  <div class="p-8">
    <h1 class="text-maroon mb-6 text-2xl font-bold">Offices and Administrator</h1>

    <!-- Add Faculty/Staff Button -->
    <button
      @click="showAddModal = true"
      class="bg-maroon rounded px-4 py-2 text-white shadow hover:bg-red-600"
    >
      + Add Faculty and Staff
    </button>

    <!-- College Dean Section -->
    <div class="mt-8" v-if="collegeDean">
      <h2 class="mb-4 text-center text-xl font-semibold">College Dean</h2>
      <div class="flex justify-center">
        <div class="cursor-pointer text-center" @click="showProfilePreview(collegeDean)">
          <img
            :src="collegeDean.photo || '/placeholder.png'"
            alt="College Dean"
            class="mx-auto h-32 w-32 rounded-full object-cover"
          />
          <p class="mt-2 text-lg font-bold">
            {{
              collegeDean?.name ||
              (collegeDean?.firstName && collegeDean?.lastName
                ? `${collegeDean.firstName} ${collegeDean.lastName}`
                : "No Dean Assigned")
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- College Secretary Section -->
    <div class="mt-8" v-if="collegeSecretary">
      <h2 class="mb-4 text-center text-xl font-semibold">College Secretary</h2>
      <div class="flex justify-center">
        <div class="cursor-pointer text-center" @click="showProfilePreview(collegeSecretary)">
          <img
            :src="collegeSecretary.photo || '/placeholder.png'"
            alt="College Secretary"
            class="mx-auto h-32 w-32 rounded-full object-cover"
          />
          <p class="mt-2 text-lg font-bold">
            {{
              collegeSecretary?.name ||
              (collegeSecretary?.firstName && collegeSecretary?.lastName
                ? `${collegeSecretary.firstName} ${collegeSecretary.lastName}`
                : "No Secretary Assigned")
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Head Members Section -->
    <div class="mt-12" v-if="headAdmins.length">
      <h2 class="mb-4 text-center text-xl font-semibold">Head Members</h2>
      <div class="grid grid-cols-4 gap-6">
        <div
          v-for="head in headAdmins"
          :key="head.id"
          class="cursor-pointer text-center"
          @click="showProfilePreview(head)"
        >
          <img
            :src="head.photo || '/placeholder.png'"
            alt="Head Member"
            class="mx-auto h-24 w-24 rounded-full object-cover"
          />
          <p class="mt-2 text-lg font-bold">
            {{
              head?.name ||
              (head?.firstName && head?.lastName
                ? `${head.firstName} ${head.lastName}`
                : "No Head Assigned")
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Administrative Staff Section -->
    <div class="mt-12" v-if="adminStaff.length">
      <h2 class="mb-4 text-center text-xl font-semibold">Administrative Staff</h2>
      <div class="grid grid-cols-4 gap-6">
        <div
          v-for="staff in adminStaff"
          :key="staff.id"
          class="cursor-pointer text-center"
          @click="showProfilePreview(staff)"
        >
          <img
            :src="staff.photo || '/placeholder.png'"
            alt="Administrative Staff"
            class="mx-auto h-24 w-24 rounded-full object-cover"
          />
          <p class="mt-2 text-lg font-bold">
            {{ staff?.name ? staff.name : "No Staff Assigned" }}
          </p>
          <p class="text-sm text-gray-600">
            {{ staff.subDesignation || "N/A" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Profile Preview Modal -->
    <div
      v-if="showProfilePreviewModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-2/3 max-w-3xl rounded-lg bg-white p-8 shadow-lg">
        <div class="relative text-center">
          <!-- Profile Picture -->
          <img
            :src="selectedProfile?.photo || '/placeholder.png'"
            alt="Profile Picture"
            class="mx-auto h-32 w-32 rounded-full object-cover shadow-lg"
          />
          <!-- Name -->
          <h2 class="text-maroon mt-4 text-2xl font-bold">
            {{
              selectedProfile?.firstName && selectedProfile?.lastName
                ? `${selectedProfile.firstName} ${selectedProfile.lastName}`
                : "No Name Provided"
            }}
          </h2>
          <!-- Designation -->
          <p class="text-lg font-semibold text-gray-500">
            {{ selectedProfile?.designation || "No Designation" }}
          </p>

          <!-- Delete/Deactivate Button -->
          <div
            class="absolute right-0 top-0 cursor-pointer text-red-500 hover:text-red-700"
            @click="removeUserFromCollegeWide(selectedProfile)"
          >
            <Trash class="h-6 w-6" />
          </div>
        </div>

        <!-- Profile Details -->
        <div class="mt-6 space-y-4 text-lg">
          <!-- Specialization -->
          <div>
            <p class="text-maroon font-semibold">Specialization:</p>
            <p>{{ selectedProfile?.specialization || "N/A" }}</p>
          </div>
          <!-- Email -->
          <div>
            <p class="text-maroon font-semibold">Email:</p>
            <p>{{ selectedProfile?.email || "N/A" }}</p>
          </div>
          <!-- Highest Educational Attainment -->
          <div>
            <p class="text-maroon font-semibold">Highest Educational Attainment:</p>
            <span class="prose text-black" v-html="selectedProfile?.education || 'N/A'"></span>
          </div>
        </div>
        <!-- Close Button -->
        <div class="mt-6 text-center">
          <button
            class="bg-maroon rounded-lg px-6 py-2 text-white shadow hover:bg-red-700"
            @click="closeProfilePreviewModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Add Faculty/Staff Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-96 rounded bg-white p-8 shadow-lg">
        <h2 class="mb-4 text-lg font-bold">Add Faculty/Staff</h2>

        <!-- Search Bar with Suggestions -->
        <div class="relative mb-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              @focus="dropdownVisible = true"
              @input="filterUsers"
              @blur="hideDropdown"
              type="text"
              placeholder="Search Faculty"
              class="w-full rounded border px-3 py-2 pl-10"
            />
            <Search class="absolute left-3 top-2 h-5 w-5 text-gray-500" />
          </div>
          <ul
            v-if="dropdownVisible && filteredUsers.length"
            class="absolute z-10 mt-1 w-full rounded border bg-white shadow"
          >
            <li
              v-for="user in filteredUsers"
              :key="user.id"
              @mousedown="selectUser(user)"
              class="cursor-pointer hover:bg-gray-200"
            >
              {{ user.name }}
            </li>
          </ul>
        </div>
        <!-- Designation Dropdown -->
        <div class="mb-4">
          <label class="block text-sm font-medium">Designation:</label>
          <select v-model="selectedUser.designation" class="w-full rounded border px-3 py-2">
            <option value="" disabled>Select Designation</option>
            <option value="College Dean">College Dean</option>
            <option value="College Secretary">College Secretary</option>
            <option value="Department Head">Department Head</option>
            <option value="Administrative Staff">Administrative Staff</option>
          </select>
        </div>

        <!-- Sub-Designation for Administrative Staff -->
        <div v-if="selectedUser.designation === 'Administrative Staff'" class="mb-4">
          <label class="block text-sm font-medium">Sub-Designation:</label>
          <input
            v-model="selectedUser.subDesignation"
            type="text"
            placeholder="e.g., Administrative Aide IV"
            class="w-full rounded border px-3 py-2"
          />
        </div>

        <div class="mt-4 flex justify-end space-x-2">
          <button @click="resetModal" class="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
            Cancel
          </button>
          <button
            @click="addFacultyOrStaff"
            class="bg-maroon rounded px-4 py-2 text-white hover:bg-red-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Search from "@/components/Icons/Search.vue";
  import Trash from "@/components/Icons/trash.vue";
  import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getFirestore,
    onSnapshot,
    updateDoc,
  } from "firebase/firestore";
  import { onMounted, ref } from "vue";

  const db = getFirestore();

  // State variables
  const collegeDean = ref(null);
  const collegeSecretary = ref(null);
  const headAdmins = ref([]);
  const adminStaff = ref([]);
  const showAddModal = ref(false);
  const showProfilePreviewModal = ref(false);
  const selectedProfile = ref(null);
  const users = ref([]);
  const filteredUsers = ref([]);
  const searchQuery = ref("");
  const selectedUser = ref({});

  definePageMeta({
    middleware: "auth",
    layout: "super-admin",
  });

  const dropdownVisible = ref(false);

  // Function to hide the dropdown
  const hideDropdown = () => {
    setTimeout(() => {
      dropdownVisible.value = false;
    }, 200); // Timeout to allow click on dropdown item
  };

  // Real-time listener for Faculty and Staff
  const fetchCollegeFacultyStaffRealTime = () => {
    const docRef = doc(db, "college_faculty_staff", "college-wide");

    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        // Filter out inactive college dean
        collegeDean.value = data.collegeDean?.status === "inactive" ? null : data.collegeDean;

        // Filter out inactive college secretary
        collegeSecretary.value =
          data.collegeSecretary?.status === "inactive" ? null : data.collegeSecretary;

        // Filter out inactive head admins
        headAdmins.value = (data.headAdmins || []).filter((admin) => admin.status !== "inactive");

        // Filter out inactive admin staff
        adminStaff.value = (data.adminStaff || []).filter((staff) => staff.status !== "inactive");
      } else {
        console.error("college-wide document not found.");
      }
    });
  };

  // Synchronize changes from `users` to `college_faculty_staff`
  const syncUserChangesToCollege = () => {
    const usersCollection = collection(db, "users");
    onSnapshot(usersCollection, async (snapshot) => {
      const updatedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const collegeDocRef = doc(db, "college_faculty_staff", "college-wide");
      const collegeDoc = await getDoc(collegeDocRef);

      if (collegeDoc.exists()) {
        const collegeData = collegeDoc.data();

        // Preserve designation and sync with user collection
        const syncWithPreservation = (entry, role) => {
          const matchedUser = updatedUsers.find(
            (user) => user.id === entry.id && user.status !== "inactive"
          );
          if (matchedUser) {
            return {
              ...entry, // Preserve designation or subDesignation
              name: `${matchedUser.firstName || "No"} ${matchedUser.lastName || "Name Assigned"}`.trim(),
              photo: matchedUser.photo || entry.photo,
              email: matchedUser.email || entry.email,
              specialization: matchedUser.specialization || entry.specialization,
              status: matchedUser.status,
            };
          }
          // Retain original entry if user is inactive
          return entry;
        };

        // Update collegeDean
        if (collegeData.collegeDean?.id) {
          const updatedDean = syncWithPreservation(collegeData.collegeDean, "College Dean");
          await updateDoc(collegeDocRef, { collegeDean: updatedDean });
        }

        // Update collegeSecretary
        if (collegeData.collegeSecretary?.id) {
          const updatedSecretary = syncWithPreservation(
            collegeData.collegeSecretary,
            "College Secretary"
          );
          await updateDoc(collegeDocRef, { collegeSecretary: updatedSecretary });
        }

        // Update headAdmins
        const updatedHeadAdmins = (collegeData.headAdmins || []).map((admin) =>
          syncWithPreservation(admin, "Head Admin")
        );
        await updateDoc(collegeDocRef, { headAdmins: updatedHeadAdmins });

        // Update adminStaff
        const updatedAdminStaff = (collegeData.adminStaff || []).map((staff) =>
          syncWithPreservation(staff, "Administrative Staff")
        );
        await updateDoc(collegeDocRef, { adminStaff: updatedAdminStaff });
      }
    });
  };

  // Function to show profile preview
  const showProfilePreview = (profile) => {
    selectedProfile.value = {
      ...profile,
      firstName: profile.firstName || profile.name?.split(" ")[0] || "No",
      lastName: profile.lastName || profile.name?.split(" ").slice(1).join(" ") || "Name Provided",
      name:
        profile.name ||
        `${profile.firstName || "No"} ${profile.lastName || "Name Provided"}`.trim(),
    };
    showProfilePreviewModal.value = true;
  };

  // Function to close profile preview modal
  const closeProfilePreviewModal = () => {
    selectedProfile.value = null;
    showProfilePreviewModal.value = false;
  };

  // Function to remove user from College-Wide document
  const removeUserFromCollegeWide = async (user) => {
  const collegeDocRef = doc(db, "college_faculty_staff", "college-wide");

  try {
    const confirm = window.confirm(`Are you sure you want to remove ${user.name || "this user"}?`);
    if (!confirm) return;

    // Fetch the College-Wide document
    const collegeDoc = await getDoc(collegeDocRef);
    if (!collegeDoc.exists()) {
      alert("College-Wide document not found.");
      return;
    }

    const collegeData = collegeDoc.data();

    // Determine where to remove the user
    if (collegeData.collegeDean?.id === user.id) {
      await updateDoc(collegeDocRef, { collegeDean: null });
    } else if (collegeData.collegeSecretary?.id === user.id) {
      await updateDoc(collegeDocRef, { collegeSecretary: null });
    } else if (collegeData.headAdmins?.some((admin) => admin.id === user.id)) {
      const updatedHeadAdmins = collegeData.headAdmins.filter((admin) => admin.id !== user.id);
      await updateDoc(collegeDocRef, { headAdmins: updatedHeadAdmins });
    } else if (collegeData.adminStaff?.some((staff) => staff.id === user.id)) {
      const updatedAdminStaff = collegeData.adminStaff.filter((staff) => staff.id !== user.id);
      await updateDoc(collegeDocRef, { adminStaff: updatedAdminStaff });
    } else {
      alert("User not found in the College-Wide document.");
      return;
    }

    alert(`${user.name || "User"} has been removed from College-Wide.`);
  } catch (error) {
    console.error("Error removing user from College-Wide:", error);
    alert("Failed to remove the user. Please try again.");
  }
};


  // Filter users based on search query
  const filterUsers = () => {
    const query = searchQuery.value.toLowerCase();
    filteredUsers.value = query
      ? users.value.filter((user) => user.name.toLowerCase().includes(query))
      : [...users.value];
  };

  // Select a user from the search suggestions
  const selectUser = (user) => {
    selectedUser.value = { ...user };
    searchQuery.value = user.name;
    filteredUsers.value = [];
  };

  // Reset the modal
  const resetModal = () => {
    selectedUser.value = {};
    searchQuery.value = "";
    showAddModal.value = false;
  };

  // Add a faculty or staff member
  const addFacultyOrStaff = async () => {
    if (!selectedUser.value.id) {
      alert("Please select a user.");
      return;
    }

    const userDocRef = doc(db, "users", selectedUser.value.id);
    const docRef = doc(db, "college_faculty_staff", "college-wide");

    try {
      // Fetch the full user document
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        alert("Selected user does not exist in the database.");
        return;
      }

      const userData = userDoc.data();

      // Create the new staff object with all relevant fields from the user document
      // Create the new staff object with all relevant fields from the user document
      const newStaff = {
        id: userDoc.id,
        name: `${userData.firstName || "No"} ${userData.lastName || "Name Assigned"}`.trim(),
        designation: selectedUser.value.designation,
        photo: userData.photo || "/placeholder.png",
        email: userData.email || "N/A",
        specialization: userData.specialization || "N/A",
        status: "active",
        // Only include subDesignation for Administrative Staff
        ...(selectedUser.value.designation === "Administrative Staff" && {
          subDesignation: selectedUser.value.subDesignation || "General Staff",
        }),
      };

      // Add the user to the appropriate section
      if (selectedUser.value.designation === "College Dean") {
        await updateDoc(docRef, { collegeDean: newStaff });
      } else if (selectedUser.value.designation === "College Secretary") {
        await updateDoc(docRef, { collegeSecretary: newStaff });
      } else if (selectedUser.value.designation === "Administrative Staff") {
        await updateDoc(docRef, { adminStaff: arrayUnion(newStaff) });
      } else if (selectedUser.value.designation === "Department Head") {
        await updateDoc(docRef, { headAdmins: arrayUnion(newStaff) });
      }

      resetModal();
      alert("Faculty/Staff successfully added!");
    } catch (error) {
      console.error("Error adding Faculty/Staff:", error);
      alert("Failed to add Faculty/Staff. Please try again.");
    }
  };

  // Fetch data on page load
  onMounted(() => {
    const usersCollection = collection(db, "users");
    onSnapshot(usersCollection, (snapshot) => {
      users.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        name: `${doc.data().firstName || ""} ${doc.data().lastName || ""}`.trim(),
      }));
      filterUsers();
    });

    fetchCollegeFacultyStaffRealTime();
    syncUserChangesToCollege();
  });
</script>

<style scoped>
  .text-maroon {
    color: #740505;
  }
  .bg-maroon {
    background-color: #740505;
  }
</style>
