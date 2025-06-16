//package vn.trijava.springrest.repository;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
//import org.springframework.stereotype.Repository;
//
//import vn.trijava.springrest.domain.Company;
//import vn.trijava.springrest.domain.User;
//import java.util.List;
//
//@Repository
//public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
//    User findByEmail(String email);
//
//    boolean existsByEmail(String email);
//
//    User findByRefreshTokenAndEmail(String token, String email);
//
//    List<User> findByCompany(Company company);
//}

package vn.trijava.springrest.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import vn.trijava.springrest.domain.Company;
import vn.trijava.springrest.domain.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    boolean existsByEmail(String email);

    User findByEmail(String email);

    User findByRefreshTokenAndEmail(String refreshToken, String email);

    List<User> findByCompany(Company company);

    Optional<User> findByResetCode(String resetCode); // New method for reset code
}