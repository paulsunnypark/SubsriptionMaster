import { supabase } from '@/integrations/supabase/client';

export const seedTestUsers = async () => {
  const testUsers = [
    {
      email: 'admin@testmail.com',
      password: 'admin123',
      fullName: 'Admin User'
    },
    {
      email: 'test@testmail.com', 
      password: 'test123',
      fullName: 'Test User'
    }
  ];

  const results = [];

  for (const user of testUsers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.fullName
          }
        }
      });

      if (error) {
        console.error(`Failed to create ${user.email}:`, error.message);
        results.push({ email: user.email, success: false, error: error.message });
      } else {
        console.log(`Successfully created ${user.email}`);
        results.push({ email: user.email, success: true, userId: data.user?.id });
      }
    } catch (err) {
      console.error(`Error creating ${user.email}:`, err);
      results.push({ email: user.email, success: false, error: 'Unknown error' });
    }
  }

  return results;
};

// For manual testing in browser console
if (typeof window !== 'undefined') {
  (window as any).seedTestUsers = seedTestUsers;
}