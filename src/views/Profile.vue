<template>
  <div class="container">
    <div class="row align-items-center profile-header">
      <div style="padding-right: 20px;">
        <img
          :src="user?.picture"
          alt="User's profile picture"
          class="nav-user-profile rounded-circle"
        />
      </div>
      <div class="text-left text-md-left" style="padding-left: 40px;">
        <h2>{{ user?.name }}</h2>
        <p class="lead text-muted">{{ user?.email }}</p>
      </div>
    </div>

    <div class="row">
      <pre v-highlightjs><code class="json">{{JSON.stringify(user, null, 2)}}</code></pre>
    </div>
  </div>
</template>

<script>
import { useAuth0 } from '@auth0/auth0-vue';

export default {
  name: "profile",
  setup() {
    const auth0 = useAuth0();

    return {
      user: auth0.user,
    }
  }
};
</script>

<style>
.nav-user-profile {
  max-width: unset;
}
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}
</style>
