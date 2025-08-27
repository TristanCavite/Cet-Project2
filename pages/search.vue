<template>
  <div class="mx-auto max-w-5xl space-y-6 px-4 py-10">
    <h1 class="text-3xl font-bold text-maroon">
      Search Results for: <span class="italic">"{{ route.query.q }}"</span>
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500">Searching...</div>

    <!-- No Results -->
    <div v-else-if="paginatedResults.length === 0" class="text-gray-600">No results found.</div>

    <!-- Results -->
    <div v-else class="space-y-6">
      <div
        v-for="item in paginatedResults"
        :key="item.url"
        class="rounded border bg-white p-4 shadow transition hover:shadow-lg"
      >
        <div class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {{ item.tag }}
        </div>

        <NuxtLink
          :to="item.url"
          class="mb-1 inline-block text-xl font-bold text-maroon transition hover:underline"
        >
          {{ item.title }}
        </NuxtLink>

        <p v-if="item.displayDate" class="mb-2 text-sm text-gray-500">
          {{ item.displayDate }}
        </p>

        <p class="line-clamp-3 text-gray-700">
          {{ item.snippet }}
        </p>

        <NuxtLink :to="item.url" class="mt-2 inline-block text-sm text-red-800 hover:underline">
          Read more →
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div
        class="flex flex-wrap items-center justify-center gap-2 pt-6 text-sm font-medium text-maroon"
      >
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-2 py-1 hover:underline disabled:opacity-40"
        >
          Prev
        </button>

        <button
          v-for="n in totalPages"
          :key="n"
          @click="goToPage(n)"
          :class="[
            'h-8 w-8 border transition',
            n === currentPage ? 'bg-gray-200 text-maroon' : 'hover:underline',
          ]"
        >
          {{ n }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-2 py-1 hover:underline disabled:opacity-40"
        >
          Next
        </button>
        <button
          @click="goToPage(totalPages)"
          :disabled="currentPage === totalPages"
          class="px-2 py-1 hover:underline disabled:opacity-40"
        >
          End
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * Searches across:
   *  - about_sections (overview, facilities, history, map)
   *  - college_faculty_staff/college-wide (Administration)
   *  - departments (dept name/content + staff; links to /about/dept_personels/[id])
   *  - department_pages (dept page content; links to /academics/departments/[id])
   *  - admission_sections (why choose, undergraduate, graduate)
   *  - news, events, researches, downloads
   */
  import { collection, doc, getDoc, getDocs, Timestamp } from "firebase/firestore";
  import { computed, ref, watchEffect } from "vue";
  import { useRoute } from "vue-router";
  import { useFirestore } from "vuefire";

  definePageMeta({ layout: "default" });

  // ---------- utils
  function stripHtml(html: string | undefined) {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function truncate(text: string, n = 220) {
    if (!text) return "";
    return text.length > n ? text.slice(0, n) + "…" : text;
  }
  function tsToDate(ts: any): Date | null {
    if (!ts) return null;
    if (ts?.toDate) return ts.toDate() as Date;
    if (typeof ts === "string") {
      const d = new Date(ts);
      return isNaN(+d) ? null : d;
    }
    return null;
  }
  function fmtDate(d: Date | null | undefined) {
    if (!d) return "";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  // ---------- routing maps for static pages
  const ABOUT_PAGE_MAP: Record<string, { title: string; url: string }> = {
    the_college: { title: "The Faculty of Engineering", url: "/about/faculty" },
    facilities: { title: "Facilities", url: "/about/facilities" },
    history: { title: "History", url: "/about/history" },
    map: { title: "Map and Location", url: "/about/map" },
  };
  const ADMISSION_PAGE_MAP: Record<string, { title: string; url: string }> = {
    why_choose_vsu: { title: "Why choose VSU?", url: "/admission/why_choose_cet" }, // adjust if your route differs
    why_choose_cet: { title: "Why choose VSU?", url: "/admission/why_choose_cet" },
    undergraduate: { title: "Undergraduate", url: "/admission/undergraduate" },
    graduate: { title: "Graduate", url: "/admission/graduate" },
  };

  // ---------- state
  const db = useFirestore();
  const route = useRoute();
  const loading = ref(true);

  type Result = {
    title: string;
    url: string;
    tag: string;
    snippet: string;
    date?: Date | null;
    displayDate?: string;
  };

  const allResults = ref<Result[]>([]);
  const deptNameById = new Map<string, string>();
  // ---------- pagination
  const currentPage = ref(1);
  const itemsPerPage = 5;

  const totalPages = computed(() => Math.max(1, Math.ceil(allResults.value.length / itemsPerPage)));

  const paginatedResults = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return allResults.value.slice(start, start + itemsPerPage);
  });

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ---------- main search
  watchEffect(async () => {
    const q = ((route.query.q as string) || "").trim();
    currentPage.value = 1;
    allResults.value = [];
    if (!q) return;
    const needle = q.toLowerCase();

    loading.value = true;
    const bucket: Result[] = [];

    

    // --- About sections (overview, facilities, history, map)
    {
      const snap = await getDocs(collection(db, "about_sections"));
      for (const d of snap.docs) {
        const id = d.id;
        const data: any = d.data();
        const hay = `${id} ${stripHtml(data?.content)}`.toLowerCase();
        if (hay.includes(needle)) {
          const meta = ABOUT_PAGE_MAP[id];
          if (meta) {
            bucket.push({
              title: meta.title,
              url: meta.url,
              tag: "About",
              snippet: truncate(stripHtml(data?.content)),
            });
          }
        }
      }
    }

    // --- Admission sections
    {
      const snap = await getDocs(collection(db, "admission_sections"));
      for (const d of snap.docs) {
        const id = d.id;
        const data: any = d.data();
        const hay = `${id} ${stripHtml(data?.content)}`.toLowerCase();
        if (hay.includes(needle)) {
          const meta = ADMISSION_PAGE_MAP[id];
          if (meta) {
            bucket.push({
              title: meta.title,
              url: meta.url,
              tag: "Admission",
              snippet: truncate(stripHtml(data?.content)),
            });
          }
        }
      }
    }

    // --- Administration (college-wide people)
    {
      // doc path: college_faculty_staff / college-wide
      const cwRef = doc(db, "college_faculty_staff", "college-wide");
      const cw = await getDoc(cwRef);
      if (cw.exists()) {
        const data: any = cw.data();

        const pools: any[] = [];
        // arrays you showed: adminStaff[], departmentHeads[], plus single objects
        if (Array.isArray(data?.adminStaff)) pools.push(...data.adminStaff);
        if (Array.isArray(data?.departmentHeads)) pools.push(...data.departmentHeads);
        if (data?.collegeDean) pools.push(data.collegeDean);
        if (data?.collegeSecretary) pools.push(data.collegeSecretary);

        for (const p of pools) {
          const personHay = JSON.stringify(p).toLowerCase();
          if (personHay.includes(needle)) {
            const name = p.fullName || p.name || "College Personnel";
            bucket.push({
              title: name,
              url: "/about/administration",
              tag: "Facilities and Administration",
              snippet: truncate(
                [p.designation, stripHtml(p.educationHtml)].filter(Boolean).join(" — ")
              ),
            });
          }
        }
      }
    }

    // --- Departments (name/content match → dept page; staff match → dept personnel page)
    {
      const snap = await getDocs(collection(db, "departments"));
      for (const d of snap.docs) {
        const id = d.id;
        const data: any = d.data();
        const deptName = data?.name || "Department";
        deptNameById.set(id, deptName);
        

        // ✅ NEW: also search the Department Head (headAdmin)
        const head = data?.headAdmin;
        if (head) {
          const headHay = JSON.stringify(head).toLowerCase();
          if (headHay.includes(needle)) {
            const name = head.fullName || head.name || "Department Head";
            bucket.push({
              title: `${name} — ${deptName}`, // show the department name
              url: `/about/dept_personels/${id}`, // go to dept personnel page
              tag: "Department Personnel",
              snippet: truncate(
                [head.designation, stripHtml(head.educationHtml)].filter(Boolean).join(" — ")
              ),
            });
          }
        }

        // existing: search staff[]
        if (Array.isArray(data?.staff)) {
          for (const s of data.staff) {
            const staffHay = JSON.stringify(s).toLowerCase();
            if (staffHay.includes(needle)) {
              const name = s.fullName || s.name || "Department Staff";
              bucket.push({
                title: `${name} — ${deptName}`,
                url: `/about/dept_personels/${id}`,
                tag: "Department Personnel",
                snippet: truncate(
                  [s.designation, stripHtml(s.educationHtml)].filter(Boolean).join(" — ")
                ),
              });
            }
          }
        }

        // (degreePrograms search stays as-is)

        // ✅ Degree programs (subcollection) – search and link to the program page
const progSnap = await getDocs(collection(db, 'departments', id, 'degreePrograms'))
for (const p of progSnap.docs) {
  const pdata: any = p.data()

  // Search across content and optional program title/name if you have them
  const progHay = `${stripHtml(pdata?.content)} ${pdata?.title || ''} ${pdata?.name || ''}`.toLowerCase()

  if (progHay.includes(needle)) {
    bucket.push({
      // Show program title if available, otherwise a generic label with dept name
      title: (pdata?.title || pdata?.name || 'Degree Program'),

      url: `/academics/degree-programs/${id}/${p.id}`,
      tag: 'Degree Program',
      snippet: truncate(stripHtml(pdata?.content)),
    })
  }
}

      }
    }

   
    // --- Department extra pages (vision/mission/etc.)
// --- Department extra pages (vision/mission/etc.) – single source of truth for dept card
{
  const snap = await getDocs(collection(db, 'department_pages'))
  for (const d of snap.docs) {
    const id = d.id
    const data: any = d.data()

    // Make sure we also match when the user typed the department name
    let deptName = deptNameById.get(id)
    if (!deptName) {
      const depDoc = await getDoc(doc(db, 'departments', id))
      deptName = (depDoc.exists() ? (depDoc.data() as any)?.name : '') || ''
      if (deptName) deptNameById.set(id, deptName)
    }

    // Search across the page content + the department name
    const hay = `${deptName || ''} ${stripHtml(data?.content)}`.toLowerCase()
    if (hay.includes(needle)) {
      bucket.push({
        title: deptName || 'Department',
        url: `/academics/departments/${id}`,
        tag: 'Academics',
        snippet: truncate(stripHtml(data?.content)),
      })
    }
  }
}



    // --- News
    {
      const snap = await getDocs(collection(db, "news"));
      for (const d of snap.docs) {
        const data: any = d.data();
        const hay = `${data?.title} ${stripHtml(data?.content)}`.toLowerCase();
        if (hay.includes(needle)) {
          const date = tsToDate(data?.createdAt);
          bucket.push({
            title: data?.title || "News",
            url: `/news/${d.id}`,
            tag: "News",
            snippet: truncate(stripHtml(data?.content)),
            date,
            displayDate: fmtDate(date),
          });
        }
      }
    }

    // --- Events
    {
      const snap = await getDocs(collection(db, "events"));
      for (const d of snap.docs) {
        const data: any = d.data();
        const hay = `${data?.title} ${stripHtml(data?.content)}`.toLowerCase();
        if (hay.includes(needle)) {
          const date = tsToDate(data?.date);
          bucket.push({
            title: data?.title || "Event",
            url: `/events/${d.id}`,
            tag: "Event",
            snippet: truncate(stripHtml(data?.content)),
            date,
            displayDate: fmtDate(date),
          });
        }
      }
    }

    // --- Researches
    {
      const snap = await getDocs(collection(db, "researches"));
      for (const d of snap.docs) {
        const data: any = d.data();
        const hay = `${data?.title} ${stripHtml(data?.content)}`.toLowerCase();
        if (hay.includes(needle)) {
          bucket.push({
            title: data?.title || "Research",
            url: `/research/${d.id}`,
            tag: "Research",
            snippet: truncate(stripHtml(data?.content)),
          });
        }
      }
    }

    // --- Downloads (single index page)
{
  const snap = await getDocs(collection(db, 'downloads'))
  let pushed = false

  for (const d of snap.docs) {
    const data: any = d.data()
    const hay = `${data?.title || ''} ${stripHtml(data?.content) || ''} ${data?.author || ''}`.toLowerCase()

    if (hay.includes(needle) && !pushed) {
      bucket.push({
        title: data?.title || 'College Downloads',
        url: '/download',              // <-- points to pages/download/index.vue
        tag: 'Downloads',
        snippet: truncate(stripHtml(data?.content)),
      })
      pushed = true                   // ensure we only add one card
    }
  }
}


    // optional: sort (news/events by date desc first, then others by title)
    bucket.sort((a, b) => {
      const at = a.date ? +a.date : 0;
      const bt = b.date ? +b.date : 0;
      if (bt !== at) return bt - at;
      return a.title.localeCompare(b.title);
    });

    allResults.value = bucket;
    loading.value = false;
  });
</script>

<style scoped>
  .text-maroon {
    color: #740505;
  }
</style>
